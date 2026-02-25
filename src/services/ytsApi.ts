import { YTSResponse } from "../types";

const BASE_URL = "/api";

export const fetchMovies = async (
  page: number = 1,
  queryTerm: string = "",
  limit: number = 20,
): Promise<YTSResponse> => {
  try {
    const url = new URL(`${window.location.origin}${BASE_URL}/movies`);
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
    console.error("Error fetching movies:", error);
    throw error;
  }
};
