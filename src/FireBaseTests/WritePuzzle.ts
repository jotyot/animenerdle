import { query, collection, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

const q = query(collection(db, "properties"));
const querySnapshot = await getDocs(q);

const PropList: { name: string; entries: Entry[] }[] = [];

querySnapshot.forEach((doc) => {
  PropList.push({ name: doc.get("name"), entries: doc.get("entries") });
});

const RawPuzzle = MakePuzzle();
const ShuffledPuzzle = ShufflePuzzle(RawPuzzle);
try {
  await setDoc(doc(db, "puzzles", "puzzle1"), ShuffledPuzzle);
  console.log("Document written with ID: ", "puzzle1");
} catch (e) {
  console.error("Error adding document: ", e);
}

interface Entry {
  name: string;
  properties: string[];
}

interface PuzzleItem {
  name: string;
  property1: string;
  property2?: string;
}

function ShufflePuzzle(puzzle: {
  properties: string[];
  entries: PuzzleItem[];
}) {
  const lines: [number, number, number, number][] = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11],
    [12, 13, 14, 15],
    [0, 4, 8, 12],
    [1, 5, 9, 13],
    [2, 6, 10, 14],
    [3, 7, 11, 15],
  ];
  let shuffled = puzzle.entries;
  while (
    lines.some((line) => {
      const prop1s = line.map((n) => shuffled[n].property1);
      const prop2s = line.map((n) => shuffled[n].property2);
      return ThreePlusMatch(prop1s) || ThreePlusMatch(prop2s);
    })
  ) {
    shuffled = shuffled
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }
  return { properties: puzzle.properties, entries: shuffled };
}

function ThreePlusMatch(props: (string | undefined)[]): boolean {
  return props.some(
    (prop, _, propLine) =>
      prop && propLine.filter((x) => x === prop).length >= 3
  );
}

function MakePuzzle() {
  while (true) {
    let { failed, propertyE, puzzleProperties, eAnimes } = GetPropertyE();

    const properties = [...puzzleProperties, propertyE];
    const entries = [...eAnimes];
    puzzleProperties.forEach((property) => {
      const animes = SinglePropertyAnimes(property, entries, properties);
      failed = failed || animes.failed;
      entries.push(...animes.singlePropertyAnimes);
    });

    if (!failed) return ConvertPuzzle(entries, properties);
  }
}

function RandomElement<T>(array: T[]) {
  return array[~~(Math.random() * array.length)];
}

function RandomPropertyName() {
  return RandomElement(PropList).name;
}

function RandomAnime(property: string) {
  const entries = PropList.find((prop) => prop.name === property)?.entries ?? [
    { name: "error", properties: [] },
  ];
  return RandomElement(entries);
}

function RandomAnimeProperty(anime: Entry) {
  return RandomElement(anime.properties);
}

function ConvertPuzzle(entries: Entry[], properties: string[]) {
  const puzzleItems: PuzzleItem[] = [];
  puzzleItems.push(
    ...entries.slice(0, 4).map((entry, i) => ({
      name: entry.name,
      property1: properties[i],
      property2: properties[4],
    }))
  );
  puzzleItems.push(
    ...entries.slice(4).map((entry, i) => ({
      name: entry.name,
      property1: properties[~~(i / 3)],
    }))
  );
  return {
    properties: properties,
    entries: puzzleItems,
  };
}

function GetPropertyE() {
  let loops = 0;
  const propertyE = RandomPropertyName();
  const puzzleProperties: string[] = [];
  const eAnimes: Entry[] = [];
  while (puzzleProperties.length < 4) {
    loops++;
    if (loops > 100)
      return { failed: true, propertyE, puzzleProperties, eAnimes };
    const { success, anime, newProperty } = GetEAnime(
      propertyE,
      puzzleProperties,
      eAnimes
    );
    if (success) {
      eAnimes.push(anime);
      puzzleProperties.push(newProperty);
    }
  }
  return { failed: false, propertyE, puzzleProperties, eAnimes };
}

function GetEAnime(
  propertyE: string,
  puzzleProperties: string[],
  eAnimes: Entry[]
) {
  const anime = RandomAnime(propertyE);
  const newProperty = RandomAnimeProperty(anime);
  const success =
    ValidEAnime(anime, eAnimes, puzzleProperties) &&
    ValidProperty(newProperty, eAnimes, propertyE, puzzleProperties);
  return { success, anime, newProperty };
}

function ValidEAnime(
  anime: Entry,
  eAnimes: Entry[],
  puzzleProperties: string[]
) {
  const invalidity = [
    anime.properties.length < 1,
    !ValidAnime(anime, eAnimes, eAnimes, puzzleProperties),
  ];
  return !invalidity.includes(true);
}

function ValidProperty(
  newProperty: string,
  eAnimes: Entry[],
  propertyE: string,
  puzzleProperties: string[]
) {
  const invalidity = [
    eAnimes
      .map((entry) => entry.properties)
      .flat()
      .includes(newProperty),
    DuplicatePropertyType(newProperty, [...puzzleProperties, propertyE]),
  ];
  return !invalidity.includes(true);
}

function DuplicatePropertyType(
  newProperty: string,
  puzzleProperties: string[]
) {
  const LimitedTypes = ["Voice Actor", "Theme Song Artist"];
  return (
    puzzleProperties
      .map((name) => name.split(":")[0])
      .some((type) => LimitedTypes.includes(type)) &&
    LimitedTypes.includes(newProperty.split(":")[0])
  );
}

function SinglePropertyAnimes(
  property: string,
  animes: Entry[],
  puzzleProperties: string[]
) {
  let loops = 0;
  const singlePropertyAnimes: Entry[] = [];
  while (singlePropertyAnimes.length < 3) {
    loops++;
    if (loops > 100) return { failed: true, singlePropertyAnimes };
    const { success, anime } = GetSingleAnime(
      property,
      singlePropertyAnimes,
      animes,
      puzzleProperties
    );
    if (success) singlePropertyAnimes.push(anime);
  }
  return { failed: false, singlePropertyAnimes };
}

function GetSingleAnime(
  property: string,
  singlePropertyAnimes: Entry[],
  animes: Entry[],
  puzzleProperties: string[]
) {
  const anime = RandomAnime(property);
  const success = ValidAnime(
    anime,
    singlePropertyAnimes,
    animes,
    puzzleProperties
  );
  return { success, anime };
}

function ValidAnime(
  anime: Entry,
  sameGroupAnime: Entry[],
  animes: Entry[],
  puzzleProperties: string[]
) {
  const eAnimeNames = animes.slice(0, 4).map((entry) => entry.name);
  const invalidity = [
    animes.some((entry) => entry.name === anime.name),
    IsRelated(anime.name, [
      ...eAnimeNames,
      ...sameGroupAnime.map((entry) => entry.name),
    ]),
    anime.properties.some((property) => puzzleProperties.includes(property)),
    ExtraGroup(anime, animes),
  ];
  return !invalidity.includes(true);
}

function ExtraGroup(anime: Entry, animes: Entry[]) {
  const otherProperties = [anime, ...animes]
    .map((entry) => entry.properties)
    .flat();
  return otherProperties.some(
    (property, _, list) => list.filter((x) => x === property).length >= 4
  );
}

function IsRelated(entry: string, list: string[]) {
  return list.some((item) => {
    const sim = Similarity(entry, item);
    return sim.flat > 7 || sim.ratio > 0.5;
  });
}

function Similarity(a: string, b: string) {
  a = a
    .toLowerCase()
    .replace("season", "")
    .replace("part", "")
    .replace(/" "/g, "");
  b = b
    .toLowerCase()
    .replace("season", "")
    .replace("part", "")
    .replace(/" "/g, "");
  const len = LCSLength(a, b);
  return { flat: len, ratio: len / a.length };
}

function LCSLength(a: string, b: string) {
  const n = a.length;
  const m = b.length;

  // Create DP table
  var dp = Array(2)
    .fill(0)
    .map(() => Array(m + 1).fill(0));
  var res = 0;

  for (var i = 1; i <= n; i++) {
    for (var j = 1; j <= m; j++) {
      if (a.charAt(i - 1) == b.charAt(j - 1)) {
        dp[i % 2][j] = dp[(i - 1) % 2][j - 1] + 1;
        if (dp[i % 2][j] > res) res = dp[i % 2][j];
      } else dp[i % 2][j] = 0;
    }
  }
  return res;
}
