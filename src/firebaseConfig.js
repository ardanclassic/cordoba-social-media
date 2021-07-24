import firebase from"firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_API_KEY,
//   authDomain: process.env.REACT_APP_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_SENDER_ID,
//   appId: process.env.REACT_APP_APP_ID,
// };

const firebaseConfig = {
  apiKey: "AIzaSyC5zXpQgv0lw7lAGUn3H7yrawZfxZLDDB4",
  authDomain: "auth-dev-14b25.firebaseapp.com",
  projectId: "auth-dev-14b25",
  storageBucket: "auth-dev-14b25.appspot.com",
  messagingSenderId: "230098785933",
  appId: "1:230098785933:web:c2810e6622c885f497f4c4",
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage().ref();
export const fireapp = firebase.app();