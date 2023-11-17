import { onSchedule } from "firebase-functions/v2/scheduler";
import { db } from "./firebase";
import { CreatePuzzle } from "./PuzzleMaker/CreatePuzzle";

const WritePuzzle = async () => {
  const current = (await db.doc("puzzles/current").get()).data();

  const date = new Date();
  const dateString = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;

  if (current) await db.doc("puzzles/" + dateString).set(current);

  const puzzle = await CreatePuzzle();
  await db.doc("puzzles/current").set(puzzle);
};

export const DailyPuzzle = onSchedule("every day 0:00", WritePuzzle);
