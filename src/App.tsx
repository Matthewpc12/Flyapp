import React, { useState, useEffect, useCallback } from "react";
import { fetchMovies } from "./services/ytsApi";
import { Movie } from "./types";
import { MovieCard } from "./components/MovieCard";
import { MovieModal } from "./components/MovieModal";
import { SearchBar } from "./components/SearchBar";
import { Film, Loader2, AlertCircle } from "lucide-react";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  const loadMovies = useCallback(
    async (pageNum: number, query: string, isNewSearch: boolean = false) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchMovies(pageNum, query, 20);

        if (response.status === "ok") {
          const newMovies = response.data.movies || [];

          if (isNewSearch) {
            setMovies(newMovies);
          } else {
            setMovies((prev) => [...prev, ...newMovies]);
          }

          // Check if we've reached the end
          if (newMovies.length < 20 || !response.data.movies) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }
        } else {
          setError(response.status_message || "Failed to load movies");
        }
      } catch (err) {
        setError(
          "An error occurred while fetching movies. Please try again later.",
        );
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    },
    [],
  );

  // Effect for initial load and search changes
  useEffect(() => {
    setPage(1);
    loadMovies(1, searchQuery, true);
  }, [searchQuery, loadMovies]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadMovies(nextPage, searchQuery, false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-red-600/30">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-red-600">
            <Film className="h-8 w-8" />
            <h1 className="text-2xl font-black tracking-tighter">YIFYFLIX</h1>
          </div>
          <div className="w-full sm:w-auto">
            <SearchBar onSearch={handleSearch} initialQuery={searchQuery} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Error State */}
        {error && (
          <div className="mb-8 flex items-center gap-3 rounded-lg border border-red-900/50 bg-red-950/20 p-4 text-red-200">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
            <p>{error}</p>
          </div>
        )}

        {/* Loading State (Initial) */}
        {initialLoad && loading ? (
          <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-red-600" />
            <p className="text-zinc-400 font-medium tracking-wide">
              Loading movies...
            </p>
          </div>
        ) : (
          <>
            {/* Empty State */}
            {!loading && movies.length === 0 && !error && (
              <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
                <Film className="h-16 w-16 text-zinc-700" />
                <h2 className="text-2xl font-semibold text-zinc-300">
                  No movies found
                </h2>
                <p className="text-zinc-500">
                  {searchQuery
                    ? `We couldn't find any matches for "${searchQuery}".`
                    : "There are currently no movies available."}
                </p>
              </div>
            )}

            {/* Movie Grid */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:gap-6">
              {movies.map((movie, index) => (
                <MovieCard
                  key={`${movie.id}-${index}`}
                  movie={movie}
                  onClick={setSelectedMovie}
                />
              ))}
            </div>

            {/* Load More Section */}
            {movies.length > 0 && hasMore && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-red-600 px-8 py-3 font-semibold text-white transition-all hover:bg-red-700 hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load More"
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Movie Detail Modal */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}
