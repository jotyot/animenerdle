import { PropPoolItem, Entry } from "./Types";

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

export { Randomizer };
