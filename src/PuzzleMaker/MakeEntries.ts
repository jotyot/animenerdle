import {
  TopClient,
  AnimeClient,
  AnimeTopParams,
  AnimeType,
  TopAnimeFilter,
  Anime,
  Manga,
  MangaClient,
  AnimeCharacter,
  AnimeStaff,
  AnimeSearchParams,
  SearchOrder,
  SortOptions,
} from "@tutkli/jikan-ts";
import AnimeEntry from "./AnimeEntry";
import fs from "node:fs";

const topClient = new TopClient();
const animeClient = new AnimeClient();
const mangaClient = new MangaClient();

const wait = 700;

const CharacterParams = {
  mainMin: 3,
  mainThresh: 1000,
  mainMax: 5,
  supMin: 0,
  supThresh: 1000,
  supMax: 1,
};

const Themes = [
  "Anthropomorphic",
  "CGDCT",
  "Combat Sports",
  "Harem",
  "High Stakes Game",
  "Isekai",
  "Iyashikei",
  "Mecha",
  "Music",
  "Organized Crime",
  "Romantic Subtext",
  "Samurai",
  "Team Sports",
  "Time Travel",
  "Vampire",
  "Video Game",
];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  const topIds = await IDsFromPagesTop(15);
  const recentIds = await IDsFromPagesRecent(4, 2020);
  const ids = [...new Set([...topIds, ...recentIds])];
  const entries = await MakeEntries(ids);
  fs.writeFileSync("entries.json", JSON.stringify(entries, null, 2));
})();

async function IDsFromPagesTop(finalPage: number): Promise<number[]> {
  let totalIDs: number[] = [];
  for (let i = 1; i < finalPage + 1; i++) {
    const ids = await IDsFromPageTop(i);
    totalIDs.push(...ids);
  }
  return totalIDs;
}

async function IDsFromPageTop(page: number): Promise<number[]> {
  await sleep(wait);
  const searchParams: AnimeTopParams = {
    type: AnimeType.tv,
    page: page,
    filter: TopAnimeFilter.bypopularity,
  };
  return topClient
    .getTopAnime(searchParams)
    .then((res) => res.data.map((anime) => anime.mal_id));
}

async function IDsFromPageRecent(
  page: number,
  year: number
): Promise<number[]> {
  await sleep(wait);
  const searchParams: AnimeSearchParams = {
    type: AnimeType.tv,
    page: page,
    start_date: year.toString() + "-01-01",
    order_by: SearchOrder.members,
    sort: SortOptions.desc,
  };
  return animeClient
    .getAnimeSearch(searchParams)
    .then((res) => res.data.map((anime) => anime.mal_id));
}

async function IDsFromPagesRecent(
  finalPage: number,
  year: number
): Promise<number[]> {
  let totalIDs: number[] = [];
  for (let i = 1; i < finalPage + 1; i++) {
    const ids = await IDsFromPageRecent(i, year);
    totalIDs.push(...ids);
  }
  return totalIDs;
}

async function MakeEntries(ids: number[]): Promise<AnimeEntry[]> {
  let entries: AnimeEntry[] = [];
  let i = 1;
  for (const id of ids) {
    const entry = await Entry(id);
    entries.push(entry);
    console.log(i++, entry.Name);
    fs.writeFileSync("entries.json", JSON.stringify(entries, null, 2));
  }
  return entries;
}

async function AnimeData(id: number): Promise<Anime> {
  await sleep(wait);
  return animeClient.getAnimeFullById(id).then((res) => res.data);
}

async function MangaData(id: number): Promise<Manga> {
  await sleep(wait);
  return mangaClient.getMangaById(id).then((res) => res.data);
}

async function CharacterData(id: number): Promise<AnimeCharacter[]> {
  await sleep(wait);
  return animeClient.getAnimeCharacters(id).then((res) => res.data);
}

async function StaffData(id: number): Promise<AnimeStaff[]> {
  await sleep(wait);
  return animeClient.getAnimeStaff(id).then((res) => res.data);
}

async function Magazine(data: Anime): Promise<undefined | string> {
  if (data.source !== "Manga" || !data.relations) return undefined;
  const adaptations = data.relations.filter(
    (relation) => relation.relation === "Adaptation"
  );
  if (adaptations.length < 1) return undefined;

  const mangaID = adaptations[0].entry[0].mal_id;
  const mangaData = await MangaData(mangaID);
  const serials = mangaData.serializations;
  return serials[0] && serials[0].name;
}

async function VoiceActors(id: number): Promise<string[]> {
  const data = await CharacterData(id);

  const sortedChar = data.sort((a, b) => b.favorites - a.favorites);
  const topMains = sortedChar
    .filter((char) => char.role === "Main")
    .slice(0, CharacterParams.mainMin);
  const botMains = sortedChar
    .filter((char) => char.role === "Main")
    .slice(CharacterParams.mainMin, CharacterParams.mainMax)
    .filter((char) => char.favorites >= CharacterParams.mainThresh);
  const topSups = sortedChar
    .filter((char) => char.role === "Supporting")
    .slice(0, CharacterParams.supMin);
  const botSups = sortedChar
    .filter((char) => char.role === "Supporting")
    .slice(CharacterParams.supMin, CharacterParams.supMax)
    .filter((char) => char.favorites >= CharacterParams.supThresh);

  const chars = [...topMains, ...botMains, ...topSups, ...botSups];
  console.log(chars.map((char) => char.character.name));
  const japaneseVAs = chars.map(
    (char) => char.voice_actors.filter((va) => va.language === "Japanese")[0]
  );
  return japaneseVAs.filter((va) => va).map((va) => va.person.name);
}

async function OriginalCreator(
  data: AnimeStaff[]
): Promise<string | undefined> {
  const originalCreators = data.filter((staff) =>
    staff.positions.includes("Original Creator")
  );
  return originalCreators[0] && originalCreators[0].person.name;
}

async function ThemeSongArtist(
  data: AnimeStaff[],
  voiceActors: string[]
): Promise<string[]> {
  return data
    .filter((staff) => staff.positions.includes("Theme Song Performance"))
    .map((staff) => staff.person.name)
    .filter((name) => !voiceActors.includes(name));
}

async function Entry(id: number): Promise<AnimeEntry> {
  const data = await AnimeData(id);
  const staffData = await StaffData(id);
  const voiceActors = await VoiceActors(id);
  const demo = data.demographics[0];
  const entry: AnimeEntry = {
    Name: data.title_english || data.title,
    Score:
      data.score >= 8.7
        ? "above 8.7"
        : data.score < 7
        ? "below 7.0"
        : undefined,
    Studio: data.studios.map((jikanResource) => jikanResource.name),
    Season:
      data.season &&
      data.season.charAt(0).toUpperCase() +
        data.season.slice(1) +
        " " +
        data.year,
    Source:
      data.source === "Manga" || data.source === "Web manga"
        ? undefined
        : data.source,
    Demographic:
      demo && (demo.name === "Josei" || demo.name == "Shoujo")
        ? demo.name
        : undefined,
    Theme: data.themes
      .map((jikanResource) => jikanResource.name)
      .filter((name) => Themes.includes(name)),
    Length: data.episodes > 30 ? "30+ episodes" : undefined,
    "Manga Serialization": await Magazine(data),
    "Voice Actor": voiceActors,
    "Original Creator": await OriginalCreator(staffData),
    "Theme Song Artist": await ThemeSongArtist(staffData, voiceActors),
  };
  return entry;
}
