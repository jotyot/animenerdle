import { onCall } from "firebase-functions/v2/https";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { db } from "./firebase";
import { ShuffledPuzzle } from "./PuzzleMaker/MakePuzzle";

const WritePuzzle = async () => {
  const current = (await db.doc("puzzles/current").get()).data();

  const date = new Date();
  const dateString = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;

  if (current) await db.doc("puzzles/" + dateString).set(current);

  const puzzle = await ShuffledPuzzle();
  await db.doc("puzzles/current").set(puzzle);
};

export const ManualWritePuzzle = onCall(WritePuzzle);

export const DailyPuzzle = onSchedule("every day 0:00", WritePuzzle);
