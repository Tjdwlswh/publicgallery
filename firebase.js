import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC6GULHuR6oqs0dk21y7KPlpF9zuDovmH8",
  authDomain: "snsjinny.firebaseapp.com",
  projectId: "snsjinny",
  storageBucket: "snsjinny.appspot.com",
  messagingSenderId: "16892023475",
  appId: "1:16892023475:web:ad604fbd678ebea5ad56c6",
  measurementId: "G-ESPPRJDVGS",
  databaseURL: "https://snsjinny.firebaseio.com",
};

// Use this to initialize the firebase App
const firebaseApp = firebase.initializeApp(firebaseConfig);

// Use these for db & auth
const db = firebaseApp.firestore();
const store = firebaseApp.firestore;
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();

export { auth, db, storage, store };
