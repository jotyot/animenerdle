interface Entry {
  name: string;
  properties: string[];
}

interface PuzzleItem {
  name: string;
  property1: string;
  property2?: string;
}

interface Property {
  name: string;
  entries: Entry[];
}

export type { Entry, PuzzleItem, Property };
