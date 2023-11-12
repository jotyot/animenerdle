//import { ShuffledPuzzle } from "./PuzzleMaker/MakePuzzle";
import { onCall } from "firebase-functions/v2/https";
import { db } from "./firebase";
/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as logger from "firebase-functions/logger";
import { ShuffledPuzzle } from "./PuzzleMaker/MakePuzzle";

// import {onSchedule} from "firebase-functions/v2/scheduler"
// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const hello = onCall(async () => {
  const puzzle = await ShuffledPuzzle();
  try {
    await db.doc("puzzles/test").set(puzzle);
    logger.info("Generated", puzzle);
  } catch (e) {
    logger.error("Error adding document: ", e);
  }
});
