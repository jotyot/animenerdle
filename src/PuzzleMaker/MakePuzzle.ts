import fs from "node:fs";

interface Entry {
  name: string;
  properties: string[];
}

const RawData = fs.readFileSync("./props.json");
const Props = JSON.parse(RawData.toString());

const RandomValue = (obj: Object) =>
  Object.keys(obj)[~~(Math.random() * Object.keys(obj).length)];
const RandomProp = () => RandomValue(Props);
const RandomAnime = (prop: string) => RandomValue(Props[prop]);
const RandomItem = (array: any[]) => array[~~(Math.random() * array.length)];

let puzzleProps: string[];
let Animes: string[];
let EAnimes: string[];
let repeat = false;
let E = RandomProp();
let AnimeEntries: Entry[];

do {
  AnimeEntries = [];
  E = RandomProp();
  puzzleProps = [];
  Animes = [];
  EAnimes = [];

  repeat = FillProps();
  if (repeat) continue;

  Animes = [...Animes, ...EAnimes];
  repeat = puzzleProps.map((prop) => SinglePropAnime(prop)).includes(true);
  puzzleProps = [...puzzleProps, E];
} while (repeat);

const Puzzle = {
  properties: puzzleProps,
  entries: AnimeEntries,
};

fs.writeFileSync("puzzle.json", JSON.stringify(Puzzle, null, 2));

function FillProps() {
  let loopCount = 0;
  while (puzzleProps.length < 4) {
    repeat = false;
    let anime = RandomAnime(E);
    let animeProps: string[] = Props[E][anime];
    let newProp = RandomItem(animeProps);

    while (InvalidProperty(animeProps, anime, newProp)) {
      anime = RandomAnime(E);
      animeProps = Props[E][anime];
      newProp = RandomItem(animeProps);

      loopCount++;
      repeat = loopCount > 100;
      if (repeat) return true;
    }

    puzzleProps = [...puzzleProps, newProp];
    EAnimes = [...EAnimes, anime];

    let entry: Entry = {
      name: anime,
      properties: [puzzleProps[puzzleProps.length - 1], E],
    };
    AnimeEntries.push(entry);

    loopCount++;
    repeat = loopCount > 100;
    if (repeat) return true;
  }
  return false;
}

function InvalidProperty(animeProps: string[], anime: string, newProp: string) {
  return (
    animeProps.length < 1 ||
    animeProps.filter((prop) => puzzleProps.includes(prop)).length > 0 ||
    Animes.includes(anime) ||
    DupPropType(newProp, "Voice Actor") ||
    DupPropType(newProp, "Theme Song Artist") ||
    IsRelated(anime, EAnimes) ||
    EAnimes.map((an) => Props[E][an])
      .flat()
      .includes(newProp)
  );
}

function DupPropType(newProp: string, prop: string): boolean {
  return (
    [E, ...puzzleProps].map((v) => v.split(":")[0]).includes(prop) &&
    newProp.split(":")[0] === prop
  );
}

function SinglePropAnime(prop: string): boolean {
  let singlePropAnime: string[] = [];
  let loopCount = 0;
  while (singlePropAnime.length < 3) {
    let anime = RandomAnime(prop);
    let animeProps: string[] = Props[prop][anime];
    while (InvalidAnime(anime, animeProps, singlePropAnime)) {
      anime = RandomAnime(prop);
      animeProps = Props[prop][anime];
      loopCount++;
      if (loopCount > 40) return true;
    }
    singlePropAnime = [...singlePropAnime, anime];
    Animes = [...Animes, anime];

    let entry: Entry = {
      name: anime,
      properties: [prop],
    };
    AnimeEntries.push(entry);
  }
  return false;
}
function InvalidAnime(
  anime: string,
  animeProps: string[],
  singlePropAnime: string[]
) {
  return (
    Animes.includes(anime) ||
    animeProps.some((p) => puzzleProps.includes(p)) ||
    IsRelated(anime, [...EAnimes, ...singlePropAnime])
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
