import { db, store } from "../firebase";
import firebase from "firebase/compat/app";

const postsCollection = db.collection("posts");

export function createPost({ user, photoURL, description }) {
  return postsCollection.add({
    user,
    photoURL,
    description,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
}

export const PAGE_SIZE = 12;

export async function getPosts({ userId, mode, id } = {}) {
  console.log("유저dd", userId);
  let query = postsCollection.orderBy("createdAt", "desc").limit(PAGE_SIZE);
  if (userId) {
    query = query.orderBy("user.id").where("user.id", "==", userId);
  }

  console.log("query", query);
  console.log("db", postsCollection);
  if (id) {
    const cursorDoc = await postsCollection.doc(id).get();

    query = mode === "older" ? query.startAfter(cursorDoc) : query;
  }

  const snapshot = await query.get();
  const posts = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return posts;
}

export async function getOlderPosts(id, userId) {
  return getPosts({ id, mode: "older", userId });
}

export async function getNewerPosts(id, userId) {
  return getPosts({ id, mode: "newer", userId });
}

export async function updatePost({ id, description }) {
  return await postsCollection.doc(id).update({
    description,
  });
}
export async function removePost({ id }) {
  return await postsCollection.doc(id).delete();
}
