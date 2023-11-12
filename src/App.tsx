import Grid from "./Components/Grid";
import { db } from "./firebase";
import { getDoc, doc } from "firebase/firestore";

const docSnap = await getDoc(doc(db, "puzzles", "puzzle0"));
const puzzle = {
  properties: docSnap.get("properties"),
  entries: docSnap.get("entries"),
};

function App() {
  return <Grid puzzleTemplate={puzzle} />;
}

export default App;
