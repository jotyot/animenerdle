import fs from "node:fs";
import AnimeEntry from "./AnimeEntry";

const RawData = fs.readFileSync("./entries.json");
const Entries: AnimeEntry[] = JSON.parse(RawData.toString());

let PropList: any = {};

for (const entry of Entries) {
  for (const pair of Object.entries(entry).filter(
    (pair) => pair[0] !== "Name"
  )) {
    const key = pair[0];
    const values = Array.isArray(pair[1]) ? [...pair[1]] : [pair[1]];
    const props = values.map((value) => key + ": " + value);
    for (const prop of props) {
      const list: string[] = PropList[prop] || [];
      PropList[prop] = [...list, entry.Name];
    }
  }
}
for (const prop in PropList) {
  if (PropList[prop].length < 4) delete PropList[prop];
}

let Props: any = {};

for (const prop in PropList) {
  let pop: any = {};
  for (const anime of PropList[prop]) {
    let others: string[] = [];
    for (const other in PropList) {
      if (other !== prop && PropList[other].includes(anime))
        others = [...others, other];
    }
    pop[anime] = others;
  }
  Props[prop] = pop;
}

fs.writeFileSync("props.json", JSON.stringify(Props, null, 2));
