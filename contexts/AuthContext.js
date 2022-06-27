import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth } from "../hooks/firebase";
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [currentRole, setCurrentRole] = useState();

  const getRole = useCallback(
    (user = currentUser) =>
      user?.getIdTokenResult(true).then(({ claims }) => {
        return claims?.roles;
      }),
    [currentUser]
  );

  const claims = useCallback(
    () => currentUser?.getIdTokenResult(true),
    [currentUser]
  );

  const [loading, setLoading] = useState(true);

  function updateCurrentUser(data) {
    return updateProfile(currentUser, data).then((r) => currentUser.reload());
  }
  function updateUser(user, data) {
    return updateProfile(user, data);
  }

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }
  function createUser(body) {
    const options = {
      method: "POST",
      body: JSON.stringify(body),
    };
    return authenticatedFetch(
      process.env.BACKEND_URI + "firebase/user",
      options
    );
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  function handleUpdateEmail(email) {
    return updateEmail(currentUser, email);
  }

  function findConnection() {
    return fetch(process.env.BACKEND_URI);
  }
  function updatePW(newPassword) {
    return updatePassword(currentUser, newPassword);
  }
  function getToken() {
    return currentUser.getIdToken(true);
  }
  function getHeader() {
    return getToken().then((idToken) => {
      return {
        "Content-type": "application/json",
        Authorization: `Bearer ${idToken}`,
      };
    });
  }

  function resetPassword() {
    return sendPasswordResetEmail(auth, currentUser?.email)
      .then((r) => {
        console.log();
        // Password reset email sent!
        // ..
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  }

  const authenticatedFetch = (url, options) => {
    return getHeader().then((header) => {
      const defaults = { headers: header };
      options = Object.assign({}, defaults, options);

      return fetch(url, options)
        .then((response) => {
          return response.json().then((res) => {
            if (res.status !== 200 && res.status !== 201) {
              return Promise.reject(res);
            }
            return res;
          });
        })
        .catch((e) => {
          return Promise.reject(e);
        });
    });
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      await (user
        ? getRole(user).then((role) => setCurrentRole(role))
        : setCurrentRole());
      setLoading(false);
    });
    return unsubscribe;
  }, [getRole]);

  const value = {
    claims,
    currentUser,
    currentRole,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail: handleUpdateEmail,
    updatePassword,
    findConnection,
    authenticatedFetch,
    updateCurrentUser,
    updateUser,
    updatePW,
    getHeader,
    createUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
