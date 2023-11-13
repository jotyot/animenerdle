import Grid from "./Components/Grid";
import { db } from "./firebase";
import { getDoc, doc } from "firebase/firestore";

async function getPuzzle() {
  const docSnap = await getDoc(doc(db, "puzzles", "current"));
  const puzzle = {
    properties: docSnap.get("properties"),
    entries: docSnap.get("entries"),
  };
  return puzzle;
}

async function App() {
  const puzzle = await getPuzzle();
  return <Grid puzzleTemplate={puzzle} />;
}

export default App;
