import { auth, db } from "../firebase";

export const usersCollection = db.collection("users");

export function createUser({ id, displayName, photoURL }) {
  return usersCollection.doc(id).set({
    id,
    displayName,
    photoURL,
  });
}

export async function getUser(id) {
  const doc = await usersCollection.doc(id).get();
  console.log(doc);
  return doc.data();
}
