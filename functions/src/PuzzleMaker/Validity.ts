import { Entry } from "./Types";

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
    ThreePlusMatch(
      [newProperty, propertyE, ...puzzleProperties].map(
        (prop) => prop.split(":")[0]
      )
    ),
  ];
  return !invalidity.includes(true);
}

function DuplicatePropertyType(
  newProperty: string,
  puzzleProperties: string[]
) {
  const LimitedTypes = ["Voice Actor"];
  return (
    puzzleProperties
      .map((name) => name.split(":")[0])
      .some((type) => LimitedTypes.includes(type)) &&
    LimitedTypes.includes(newProperty.split(":")[0])
  );
}

function ThreePlusMatch(props: (string | undefined)[]): boolean {
  return props.some(
    (prop, _, propLine) =>
      prop && propLine.filter((x) => x === prop).length >= 3
  );
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

export { ValidAnime, ValidEAnime, ValidProperty, ThreePlusMatch };
