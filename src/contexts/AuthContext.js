import firebase from "firebase";
import React, { useState, useEffect, useContext, createContext } from "react";
import { useHistory } from "react-router-dom";
import { auth, firestore } from "../firebaseConfig";
import { createNewUser } from "../utils/helpers";

const AuthContext = createContext();
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const history = useHistory();
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, [history]);

  const signUp = async (email, password) => {
    await auth
      .createUserWithEmailAndPassword(email, password)
      .then(async (data) => {
        createNewUser(data);
      });
  };

  const login = (email, password) => {
    return auth.signInWithEmailAndPassword(email, password);
  };

  const loginGoogle = async () => {
    await auth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(async (data) => {
        await firestore
          .collection("users")
          .doc(data.user.email)
          .get()
          .then((userRef) => {
            if (userRef.exists) {
              return;
            } else {
              createNewUser(data);
            }
          });
      });
  };

  const resetPassword = (email) => {
    return auth.sendPasswordResetEmail(email);
  };

  const logout = () => {
    return auth.signOut();
  };

  const value = {
    currentUser,
    signUp,
    login,
    loginGoogle,
    resetPassword,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
