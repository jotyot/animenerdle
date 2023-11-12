import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import Puzzle from "../PuzzleMaker/puzzle0.json" assert { type: "json" };

const firebaseConfig = {
  apiKey: "AIzaSyCRX_iXvjZ8SuMNr5NbTL1vOfWwZi9A0tM",
  authDomain: "animenerdle.firebaseapp.com",
  projectId: "animenerdle",
  storageBucket: "animenerdle.appspot.com",
  messagingSenderId: "68600182005",
  appId: "1:68600182005:web:1afb8b8f2ac9ad953f41bc",
  measurementId: "G-BQKTDFL2XQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

try {
  await setDoc(doc(db, "puzzles", "puzzle0"), Puzzle);
  console.log("Document written with ID: ", "puzzle0");
} catch (e) {
  console.error("Error adding document: ", e);
}
