interface PuzzleTemplate {
  properties: string[];
  entries: { name: string; properties: string[] }[];
}
interface Entry {
  name: string;
  prop1: string;
  prop2: string | undefined;
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
    this.entries = template.entries.map((entry) => ({
      name: entry.name,
      prop1: entry.properties[0],
      prop2: entry.properties[1],
    }));
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
      commonProp &&
        line.forEach((n) => {
          if (tileData[n].colorID !== 4)
            tileData[n].colorID = this.properties.indexOf(commonProp);
        });
    }
    return tileData;
  }

  private CommonProp(line: [number, number, number, number]) {
    const lineEntries = line.map((n) => this.entries[n]);
    const { prop1, prop2 } = lineEntries[0];

    if (lineEntries.every((entry) => entry.prop1 === prop1)) return prop1;
    else if (lineEntries.every((entry) => entry.prop2 === prop2)) return prop2;
    else return undefined;
  }
}

export type { PuzzleTemplate };
export { Puzzle };
