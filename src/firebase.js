import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBXpXWWPqEZMSu3a-9RCMXw17NutORxOnw",
  authDomain: "voobly-online-store.firebaseapp.com",
  databaseURL: "https://voobly-online-store.firebaseio.com",
  projectId: "voobly-online-store",
  storageBucket: "voobly-online-store.appspot.com",
  messagingSenderId: "753329334005",
  appId: "1:753329334005:web:90bbdca7592b36b76307bc",
  measurementId: "G-TGYY2RT7GR",
};

firebase.initializeApp(firebaseConfig);

export const firebaseAuth = firebase.auth();
export const firestore = firebase.firestore();

export const storageRef = firebase.storage().ref();

export default firebase;
