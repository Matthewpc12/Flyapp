import { YTSResponse } from "../types";

const BASE_URLS = [
  "https://movies-api.accel.li/api/v2",
  "https://yts.bz/api/v2",
  "https://yts.lt/api/v2",
  "https://api.codetabs.com/v1/proxy?quest=https://movies-api.accel.li/api/v2"
];

export interface FetchMoviesOptions {
  page?: number;
  queryTerm?: string;
  limit?: number;
  genre?: string;
  sortBy?: string;
  orderBy?: string;
}

export const fetchMovies = async (
  options: FetchMoviesOptions = {}
): Promise<YTSResponse> => {
  const {
    page = 1,
    queryTerm = "",
    limit = 20,
    genre = "",
    sortBy = "date_added",
    orderBy = "desc"
  } = options;

  let lastError = null;

  for (const baseUrl of BASE_URLS) {
    try {
      const url = new URL(`${baseUrl}/list_movies.json`);
      url.searchParams.append("page", page.toString());
      url.searchParams.append("limit", limit.toString());
      if (queryTerm) {
        url.searchParams.append("query_term", queryTerm);
      }
      if (genre && genre !== "All") {
        url.searchParams.append("genre", genre);
      }
      if (sortBy) {
        url.searchParams.append("sort_by", sortBy);
      }
      if (orderBy) {
        url.searchParams.append("order_by", orderBy);
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
