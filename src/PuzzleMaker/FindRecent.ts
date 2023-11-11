import {
  AnimeClient,
  AnimeSearchParams,
  AnimeType,
  SearchOrder,
  SortOptions,
} from "@tutkli/jikan-ts";

const animeClient = new AnimeClient();

(async () => {
  const ids = await IDsFromPagesRecent(2, 2021);
  console.log(ids);
})();

async function IDsFromPageRecent(
  page: number,
  year: number
): Promise<number[]> {
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
