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

  const getRole = (user = currentUser) =>
    user?.getIdTokenResult(true).then(({ claims }) => {
      return claims?.roles;
    });

  const claims = useCallback(
    () => currentUser?.getIdTokenResult(true),
    [currentUser]
  );

  const [loading, setLoading] = useState(true);

  function updateUser(data) {
    return updateProfile(currentUser, data).then((r) => currentUser.reload());
  }

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  function handleUpdateEmail(email) {
    return updateEmail(currentUser, email);
  }

  function findConnection() {
    return fetch(process.env.REACT_APP_BACKEND);
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
          return Promise.reject();
        });
    });
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      await (user && getRole(user).then((role) => setCurrentRole(role)));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

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
    updateUser,
    updatePW,
    getHeader,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
