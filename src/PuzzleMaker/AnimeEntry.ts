interface AnimeEntry {
  Name: string;
  Score?: "above 8.7" | "below 7.0";
  "Original Creator"?: string;
  "Manga Serialization"?: string;
  Demographic?: string;
  "Voice Actor": string[];
  Studio: string[];
  "Theme Song Artist"?: string[];
  Season?: string;
  Length?: "30+ episodes";
  Source?: string;
  Theme: string[];
}

export default AnimeEntry;
