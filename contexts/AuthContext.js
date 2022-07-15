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
// import { customFetch } from "../utilities/utils.mjs";
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [claims, setClaims] = useState();

  const getClaims = useCallback(
    (user) =>
      user?.getIdTokenResult(true).then(({ claims }) => {
        return { roles: claims?.roles, phoneNumber: claims?.phoneNumber };
      }),
    []
  );

  function addClaims(uid, body) {
    const options = {
      method: "POST",
      body: JSON.stringify(body),
    };
    return authenticatedFetch(
      process.env.BACKEND_URI + "firebase/claims/" + uid,
      options
    );
  }

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
    return signOut(auth).then(() => {
      setCurrentUser();
      setClaims();
    });
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

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }
  const customFetch = (url, options) =>
    fetch(url, options)
      .then(async (response) => {
        return await response.json().then((res) => {
          if (res.status !== 200 && res.status !== 201) {
            return Promise.reject(res);
          }
          return res;
        });
      })
      .catch((e) => {
        return Promise.reject(e);
      });
  const authenticatedFetch = (url, options) => {
    return getHeader().then((header) => {
      const defaults = { headers: header };
      options = Object.assign({}, defaults, options);
      return customFetch(url, options);
    });
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      user && (await getClaims(user).then((claims) => setClaims(claims)));
      user && setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, [getClaims]);

  const value = {
    claims,
    currentUser,
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
    addClaims,
    customFetch,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
