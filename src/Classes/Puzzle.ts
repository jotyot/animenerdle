interface PuzzleTemplate {
  properties: string[];
  entries: Entry[];
}
interface Entry {
  name: string;
  property1: string;
  property2?: string;
}

interface TileData {
  name: string;
  colorID: number;
  glow: boolean;
}

class Puzzle {
  readonly properties: string[];
  private entries: Entry[];
  constructor(template: PuzzleTemplate) {
    this.properties = template.properties;
    this.entries = template.entries
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }
  public SwapEntries(i: number, j: number) {
    [this.entries[i], this.entries[j]] = [this.entries[j], this.entries[i]];
  }

  public getTileData() {
    const tileData = this.entries.map(
      (entry): TileData => ({
        name: entry.name,
        colorID: -1,
        glow: false,
      })
    );
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
    for (const line of lines) {
      const commonProp = this.CommonProp(line);
      if (commonProp)
        line.forEach((n) => {
          if (tileData[n].colorID !== 4)
            tileData[n].colorID = this.properties.indexOf(commonProp);
        });
      else this.AlmostProp(line).forEach((id) => (tileData[id].glow = true));
    }
    return tileData;
  }

  private CommonProp(line: [number, number, number, number]) {
    const lineEntries = line.map((n) => this.entries[n]);
    const { property1, property2 } = lineEntries[0];

    if (lineEntries.every((entry) => entry.property1 === property1))
      return property1;
    else if (lineEntries.every((entry) => entry.property2 === property2))
      return property2;
    else return undefined;
  }

  private AlmostProp(line: [number, number, number, number]) {
    const lineEntries = line.map((n) => this.entries[n]);
    for (const entry of lineEntries) {
      let almostEntries = line.filter(
        (_v, i) => lineEntries[i].property1 === entry.property1
      );
      if (almostEntries.length === 3) return almostEntries;
      almostEntries = line.filter(
        (_v, i) =>
          entry.property2 && lineEntries[i].property2 === entry.property2
      );
      if (almostEntries.length === 3) return almostEntries;
    }
    return [];
  }
}

export type { PuzzleTemplate };
export { Puzzle };
