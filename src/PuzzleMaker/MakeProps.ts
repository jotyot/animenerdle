import Entries from "./entries.json" assert { type: "json" };
import fs from "node:fs";

interface Entry {
  name: string;
  properties: string[];
}

interface Property {
  name: string;
  entries: Entry[];
}

let Props: Property[] = [];

/**
 * a list of properties with their respective animes that have that property
 */
for (const entry of Entries) {
  for (const pair of Object.entries(entry).filter(
    (pair) => pair[0] !== "Name"
  )) {
    const values = Array.isArray(pair[1]) ? [...pair[1]] : [pair[1]];
    const propNames = values.map((value) => pair[0] + ": " + value);
    const properties = propNames
      .map((name): Property => ({ name: name, entries: [] }))
      .filter((property) => !Props.some((prop) => prop.name === property.name));

    Props.push(...properties);
    for (const propName of propNames) {
      Props.find((property) => property.name === propName)?.entries.push({
        name: entry.Name,
        properties: [],
      });
    }
  }
}

Props = Props.filter((property) => property.entries.length >= 4);

/**
 * add the anime's props under it
 * for every anime, find all of the props where its referenced and add it to its props
 */
for (const property of Props) {
  for (const entry of property.entries) {
    for (const otherProperty of Props) {
      if (
        property.name !== otherProperty.name &&
        otherProperty.entries.some(
          (otherEntry) => otherEntry.name === entry.name
        )
      )
        entry.properties.push(otherProperty.name);
    }
  }
}

fs.writeFileSync(
  "./src/PuzzleMaker/props.json",
  JSON.stringify(Props, null, 2)
);
