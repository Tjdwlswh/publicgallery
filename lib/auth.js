// import auth from "@react-native-firebase/auth";
import { auth } from "../firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

import {
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

export function signIn({ email, password }) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function signUp({ email, password }) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function subscribeAuth(callback) {
  //로그인 했는지 안했는지 확인시켜줌
  return onAuthStateChanged(auth, callback);
}

export function logOut() {
  return firebase.auth().signOut();
}

// rules_version = '2';

// service cloud.firestore {
//   match /databases/{database}/documents {
//     match /{document=**} {
//       allow read, write: if
//           request.time < timestamp.date(2024, 6, 2);
//     }
//   }
// }
