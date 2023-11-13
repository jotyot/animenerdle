import { useEffect, useState } from "react";
import Grid from "./Components/Grid";
import { db } from "./firebase";
import { getDoc, doc } from "firebase/firestore";
import { PuzzleTemplate } from "./Classes/Puzzle";

function App() {
  const [puzzleTemplate, setPuzzleTemplate] = useState<PuzzleTemplate>({
    properties: [],
    entries: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getPuzzle() {
      const docSnap = await getDoc(doc(db, "puzzles", "current"));
      const puzzle = {
        properties: docSnap.get("properties"),
        entries: docSnap.get("entries"),
      };
      setPuzzleTemplate(puzzle);
      setLoading(false);
    }

    getPuzzle();
  }, []);

  return loading ? <p>Loading...</p> : <Grid puzzleTemplate={puzzleTemplate} />;
}

export default App;
