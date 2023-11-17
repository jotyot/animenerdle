import propList from "./props.json" assert { type: "json" };
import fs from "node:fs";

interface PropPoolItem {
  name: string;
  entries: Entry[];
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

class Randomizer {
  propPool: PropPoolItem[];
  constructor(propPool: PropPoolItem[]) {
    this.propPool = propPool;
  }
  RandomElement<T>(array: T[]) {
    return array[~~(Math.random() * array.length)];
  }
  RandomPropertyName() {
    return this.RandomElement(this.propPool).name;
  }
  RandomAnime(property: string) {
    const entries = this.propPool.find((prop) => prop.name === property)
      ?.entries ?? [{ name: "error", properties: [] }];
    return this.RandomElement(entries);
  }
  RandomAnimeProperty(anime: Entry) {
    return this.RandomElement(anime.properties);
  }
}

class PuzzleMaker {
  randomizer: Randomizer;
  basicProps: string[] = [];
  basicAnimes: Entry[] = [];
  overlapProp: string = "";
  overlapAnimes: Entry[] = [];
  constructor(propPool: PropPoolItem[]) {
    this.randomizer = new Randomizer(propPool);
    while (true) {
      this.basicProps = [];
      this.basicAnimes = [];
      this.overlapAnimes = [];
      let success = this.MakeOverlaps();

      this.basicProps.forEach((property) => {
        success = success && this.MakeBasicAnimes(property);
      });

      if (success) break;
    }
  }

  GetPuzzle() {
    const puzzleItems: PuzzleItem[] = [];
    puzzleItems.push(
      ...this.overlapAnimes.map((entry, i) => ({
        name: entry.name,
        property1: this.basicProps[i],
        property2: this.overlapProp,
      }))
    );
    puzzleItems.push(
      ...this.basicAnimes.map((entry, i) => ({
        name: entry.name,
        property1: this.basicProps[~~(i / 3)],
      }))
    );
    return {
      properties: this.AllProps(),
      entries: puzzleItems,
    };
  }

  ShufflePuzzle(entries: PuzzleItem[]) {
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
    let shuffled = entries;
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
    return entries;
  }

  MakeOverlaps() {
    let loops = 0;
    this.overlapProp = this.randomizer.RandomPropertyName();
    while (this.basicProps.length < 4) {
      loops++;
      if (loops > 100) return false;

      const { success, newOverlapAnime, newBasicProp } =
        this.MakeOverlapAnime();
      if (success) {
        this.overlapAnimes.push(newOverlapAnime);
        this.basicProps.push(newBasicProp);
      }
    }
    return true;
  }

  MakeOverlapAnime() {
    const newOverlapAnime = this.randomizer.RandomAnime(this.overlapProp);
    const newBasicProp = this.randomizer.RandomAnimeProperty(newOverlapAnime);
    const success =
      this.ValidOverlapAnime(newOverlapAnime) &&
      this.ValidProperty(newBasicProp);
    return { success, newOverlapAnime, newBasicProp };
  }

  MakeBasicAnimes(property: string) {
    let loops = 0;
    const basicAnimes: Entry[] = [];
    while (basicAnimes.length < 3) {
      loops++;
      if (loops > 100) return false;
      const { success, anime } = this.MakeBasicAnime(property, basicAnimes);
      if (success) basicAnimes.push(anime);
    }
    this.basicAnimes.push(...basicAnimes);
    return true;
  }

  MakeBasicAnime(property: string, sameGroupOtherAnime: Entry[]) {
    const anime = this.randomizer.RandomAnime(property);
    const success = this.ValidAnime(anime, sameGroupOtherAnime);
    return { success, anime };
  }

  ValidOverlapAnime(newAnime: Entry) {
    const invalidity = [
      newAnime.properties.length < 1,
      !this.ValidAnime(newAnime, this.overlapAnimes),
    ];
    return !invalidity.includes(true);
  }

  ValidProperty(newProperty: string) {
    const invalidity = [
      this.overlapAnimes
        .map((entry) => entry.properties)
        .flat()
        .includes(newProperty),
      this.DuplicatePropertyType(newProperty),
      ThreePlusMatch(
        [newProperty, ...this.AllProps()].map((prop) => prop.split(":")[0])
      ),
    ];
    return !invalidity.includes(true);
  }

  DuplicatePropertyType(newProperty: string) {
    const LimitedTypes: string[] = ["Voice Actor"];
    return (
      this.AllProps()
        .map((name) => name.split(":")[0])
        .some((type) => LimitedTypes.includes(type)) &&
      LimitedTypes.includes(newProperty.split(":")[0])
    );
  }

  ValidAnime(newAnime: Entry, sameGroupOtherAnime: Entry[]) {
    const invalidity = [
      this.AllAnimes().some((entry) => entry.name === newAnime.name),
      RelatedName(
        newAnime.name,
        [...this.overlapAnimes, ...sameGroupOtherAnime].map(
          (entry) => entry.name
        )
      ),
      // this works because the anime entry doesn't have the defining prop listed under itself
      newAnime.properties.some((property) =>
        this.basicProps.includes(property)
      ),
      this.ExtraGroup(newAnime, sameGroupOtherAnime),
    ];
    return !invalidity.includes(true);
  }

  ExtraGroup(newAnime: Entry, sameGroupOtherAnime: Entry[]) {
    const allOtherProperties = [newAnime, ...this.AllAnimes()]
      .map((entry) => entry.properties)
      .flat();
    const otherProperties = [...new Set(allOtherProperties)];
    const otherGroupOtherAnime = this.AllAnimes().filter(
      (entry) => !sameGroupOtherAnime.map((x) => x.name).includes(entry.name)
    );
    const extraProps = otherProperties
      .filter(
        (property, _, list) => list.filter((x) => x === property).length >= 4
      )
      .filter((extra) => !this.AllProps().includes(extra));
    return otherGroupOtherAnime.some((entry) =>
      entry.properties.some((prop) => extraProps.includes(prop))
    );
  }

  AllAnimes = () => [...this.basicAnimes, ...this.overlapAnimes];
  AllProps = () => [...this.basicProps, this.overlapProp];
}

function ThreePlusMatch(props: (string | undefined)[]): boolean {
  return props.some(
    (prop, _, propLine) =>
      prop && propLine.filter((x) => x === prop).length >= 3
  );
}

function RelatedName(name: string, others: string[]) {
  return others.some((other) => {
    const sim = Similarity(name, other);
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
  // idk if this works but it should be less lenient the front string
  const len = LCSLength(")" + a, ")" + b);
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

const puzzle = new PuzzleMaker(propList).GetPuzzle();
fs.writeFileSync("./puzzlea.json", JSON.stringify(puzzle, null, 2));
