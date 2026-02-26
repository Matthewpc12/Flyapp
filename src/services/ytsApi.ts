import { YTSResponse } from "../types";

const BASE_URLS = [
  "https://movies-api.accel.li/api/v2",
  "https://yts.bz/api/v2",
  "https://yts.lt/api/v2",
  "https://api.codetabs.com/v1/proxy?quest=https://movies-api.accel.li/api/v2"
];

export const fetchMovies = async (
  page: number = 1,
  queryTerm: string = "",
  limit: number = 20,
): Promise<YTSResponse> => {
  let lastError = null;

  for (const baseUrl of BASE_URLS) {
    try {
      const url = new URL(`${baseUrl}/list_movies.json`);
      url.searchParams.append("page", page.toString());
      url.searchParams.append("limit", limit.toString());
      if (queryTerm) {
        url.searchParams.append("query_term", queryTerm);
      }

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: YTSResponse = await response.json();
      return data;
    } catch (error) {
      console.warn(`Failed to fetch from ${baseUrl}:`, error);
      lastError = error;
    }
  }

  console.error("All YTS API endpoints failed:", lastError);
  throw lastError || new Error("Failed to fetch movies from all available endpoints");
};
