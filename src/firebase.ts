import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

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
const db = getFirestore(app);

export { app, db };
