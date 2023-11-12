// import { PuzzleItem, Entry, Property } from "./Types";
// import { ValidAnime, ValidEAnime, ValidProperty } from "./Validity";
// import { query, collection, getDocs } from "firebase/firestore";

// export async function ShuffledPuzzle() {
//   const q = query(collection(db, "properties"));
//   const querySnapshot = await getDocs(q);

//   const Proplist: Property[] = [];

//   querySnapshot.forEach((doc) => {
//     Proplist.push({ name: doc.get("name"), entries: doc.get("entries") });
//   });

//   const RawPuzzle = MakePuzzle(Proplist);
//   return Shuffle(RawPuzzle);
// }

// function Shuffle(puzzle: { properties: string[]; entries: PuzzleItem[] }) {
//   const lines: [number, number, number, number][] = [
//     [0, 1, 2, 3],
//     [4, 5, 6, 7],
//     [8, 9, 10, 11],
//     [12, 13, 14, 15],
//     [0, 4, 8, 12],
//     [1, 5, 9, 13],
//     [2, 6, 10, 14],
//     [3, 7, 11, 15],
//   ];
//   let shuffled = puzzle.entries;
//   while (
//     lines.some((line) => {
//       const prop1s = line.map((n) => shuffled[n].property1);
//       const prop2s = line.map((n) => shuffled[n].property2);
//       return ThreePlusMatch(prop1s) || ThreePlusMatch(prop2s);
//     })
//   ) {
//     shuffled = shuffled
//       .map((value) => ({ value, sort: Math.random() }))
//       .sort((a, b) => a.sort - b.sort)
//       .map(({ value }) => value);
//   }
//   return { properties: puzzle.properties, entries: shuffled };
// }

// function ThreePlusMatch(props: (string | undefined)[]): boolean {
//   return props.some(
//     (prop, _, propLine) =>
//       prop && propLine.filter((x) => x === prop).length >= 3
//   );
// }

// function MakePuzzle(proplist: Property[]) {
//   while (true) {
//     let { failed, propertyE, puzzleProperties, eAnimes } =
//       GetPropertyE(proplist);

//     const properties = [...puzzleProperties, propertyE];
//     const entries = [...eAnimes];
//     puzzleProperties.forEach((property) => {
//       const animes = SinglePropertyAnimes(
//         property,
//         entries,
//         properties,
//         proplist
//       );
//       failed = failed || animes.failed;
//       entries.push(...animes.singlePropertyAnimes);
//     });

//     if (!failed) return ConvertPuzzle(entries, properties);
//   }
// }

// function RandomElement<T>(array: T[]) {
//   return array[~~(Math.random() * array.length)];
// }

// function RandomPropertyName(proplist: Property[]) {
//   return RandomElement(proplist).name;
// }

// function RandomAnime(property: string, proplist: Property[]) {
//   const entries = proplist.find((prop) => prop.name === property)?.entries ?? [
//     { name: "error", properties: [] },
//   ];
//   return RandomElement(entries);
// }

// function RandomAnimeProperty(anime: Entry) {
//   return RandomElement(anime.properties);
// }

// function ConvertPuzzle(entries: Entry[], properties: string[]) {
//   const puzzleItems: PuzzleItem[] = [];
//   puzzleItems.push(
//     ...entries.slice(0, 4).map((entry, i) => ({
//       name: entry.name,
//       property1: properties[i],
//       property2: properties[4],
//     }))
//   );
//   puzzleItems.push(
//     ...entries.slice(4).map((entry, i) => ({
//       name: entry.name,
//       property1: properties[~~(i / 3)],
//     }))
//   );
//   return {
//     properties: properties,
//     entries: puzzleItems,
//   };
// }

// function GetPropertyE(proplist: Property[]) {
//   let loops = 0;
//   const propertyE = RandomPropertyName(proplist);
//   const puzzleProperties: string[] = [];
//   const eAnimes: Entry[] = [];
//   while (puzzleProperties.length < 4) {
//     loops++;
//     if (loops > 100)
//       return { failed: true, propertyE, puzzleProperties, eAnimes };
//     const { success, anime, newProperty } = GetEAnime(
//       propertyE,
//       puzzleProperties,
//       eAnimes,
//       proplist
//     );
//     if (success) {
//       eAnimes.push(anime);
//       puzzleProperties.push(newProperty);
//     }
//   }
//   return { failed: false, propertyE, puzzleProperties, eAnimes };
// }

// function GetEAnime(
//   propertyE: string,
//   puzzleProperties: string[],
//   eAnimes: Entry[],
//   proplist: Property[]
// ) {
//   const anime = RandomAnime(propertyE, proplist);
//   const newProperty = RandomAnimeProperty(anime);
//   const success =
//     ValidEAnime(anime, eAnimes, puzzleProperties) &&
//     ValidProperty(newProperty, eAnimes, propertyE, puzzleProperties);
//   return { success, anime, newProperty };
// }

// function SinglePropertyAnimes(
//   property: string,
//   animes: Entry[],
//   puzzleProperties: string[],
//   proplist: Property[]
// ) {
//   let loops = 0;
//   const singlePropertyAnimes: Entry[] = [];
//   while (singlePropertyAnimes.length < 3) {
//     loops++;
//     if (loops > 100) return { failed: true, singlePropertyAnimes };
//     const { success, anime } = GetSingleAnime(
//       property,
//       singlePropertyAnimes,
//       animes,
//       puzzleProperties,
//       proplist
//     );
//     if (success) singlePropertyAnimes.push(anime);
//   }
//   return { failed: false, singlePropertyAnimes };
// }

// function GetSingleAnime(
//   property: string,
//   singlePropertyAnimes: Entry[],
//   animes: Entry[],
//   puzzleProperties: string[],
//   proplist: Property[]
// ) {
//   const anime = RandomAnime(property, proplist);
//   const success = ValidAnime(
//     anime,
//     singlePropertyAnimes,
//     animes,
//     puzzleProperties
//   );
//   return { success, anime };
// }
