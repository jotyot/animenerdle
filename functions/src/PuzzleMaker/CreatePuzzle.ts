import { PuzzleItem, Entry, PropPoolItem } from "./Types";
import { Randomizer } from "./Randomizer";
import { ThreePlusMatch, RelatedName } from "./PuzzleUtil";
import { db } from "../firebase";

export async function CreatePuzzle() {
  const querySnapshot = await db.collection("properties").get();
  const PropPool: PropPoolItem[] = [];

  querySnapshot.forEach((doc) => {
    PropPool.push({ name: doc.get("name"), entries: doc.get("entries") });
  });

  const puzzleMaker = new PuzzleMaker(PropPool);
  return puzzleMaker.GetPuzzle();
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
    const entries: PuzzleItem[] = [];
    entries.push(
      ...this.overlapAnimes.map((entry, i) => ({
        name: entry.name,
        property1: this.basicProps[i],
        property2: this.overlapProp,
      }))
    );
    entries.push(
      ...this.basicAnimes.map((entry, i) => ({
        name: entry.name,
        property1: this.basicProps[~~(i / 3)],
      }))
    );
    return {
      properties: this.AllProps(),
      entries: this.ShuffleEntries(entries),
    };
  }

  ShuffleEntries(entries: PuzzleItem[]) {
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
    return shuffled;
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
    const otherProperties = [newAnime, ...this.AllAnimes()]
      .map((entry) => entry.properties)
      .flat();
    const otherGroupOtherAnime = this.AllAnimes().filter(
      (entry) => !sameGroupOtherAnime.map((x) => x.name).includes(entry.name)
    );
    const extraProps = otherProperties.filter(
      (property, _, list) => list.filter((x) => x === property).length >= 4
    );
    return otherGroupOtherAnime.some((entry) =>
      entry.properties.some((prop) => extraProps.includes(prop))
    );
  }

  AllAnimes = () => [...this.basicAnimes, ...this.overlapAnimes];
  AllProps = () => [...this.basicProps, this.overlapProp];
}
