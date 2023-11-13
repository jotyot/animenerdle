import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase.ts";

const current = await getDoc(doc(db, "puzzles/current"));

const date = new Date();
const dateString = `${date.getFullYear()}-${
  date.getMonth() + 1
}-${date.getDate()}`;

if (current.exists())
  await setDoc(doc(db, "puzzles/" + dateString), current.data());
