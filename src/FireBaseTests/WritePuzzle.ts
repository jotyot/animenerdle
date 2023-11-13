import { app } from "../firebase.ts";
import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions(app);
const hello = httpsCallable(functions, "ManualWritePuzzle");
hello().catch((e) => console.log(e));
