import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase.ts";

// import entries from "../PuzzleMaker/entries.json" assert { type: "json" };
// entries.forEach((entry) => setDoc(doc(db, "entries/" + entry.Name), entry));

import props from "../PuzzleMaker/props.json" assert { type: "json" };
props.forEach((props) => setDoc(doc(db, "properties/" + props.name), props));
