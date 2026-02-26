import React, { useState, useEffect, useCallback } from "react";
import { fetchMovies } from "./services/ytsApi";
import { Movie } from "./types";
import { MovieCard } from "./components/MovieCard";
import { MovieModal } from "./components/MovieModal";
import { SearchBar } from "./components/SearchBar";
import { HeroBanner } from "./components/HeroBanner";
import { Tabs } from "./components/Tabs";
import { DiscoverFeed } from "./components/DiscoverFeed";
import { Film, Loader2, AlertCircle, Compass, Home } from "lucide-react";

const GENRES = [
  "All",
  "Action",
  "Comedy",
  "Drama",
  "Sci-Fi",
  "Horror",
  "Romance",
  "Thriller",
  "Animation",
  "Documentary"
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'discover'>('home');
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [topMovie, setTopMovie] = useState<Movie | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  // Fetch top recommended movie
  useEffect(() => {
    const loadTopMovie = async () => {
      try {
        const response = await fetchMovies({
          limit: 1,
          sortBy: "download_count",
          orderBy: "desc"
        });
        if (response.status === "ok" && response.data.movies?.length > 0) {
          setTopMovie(response.data.movies[0]);
        }
      } catch (err) {
        console.error("Failed to load top movie", err);
      }
    };
    loadTopMovie();
  }, []);

  const loadMovies = useCallback(
    async (pageNum: number, query: string, genre: string, isNewSearch: boolean = false) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchMovies({
          page: pageNum,
          queryTerm: query,
          limit: 20,
          genre: genre === "All" ? "" : genre,
          sortBy: "download_count", // Always show more popular movies on front
          orderBy: "desc"
        });

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

  // Effect for initial load and search/genre changes
  useEffect(() => {
    setPage(1);
    loadMovies(1, searchQuery, selectedGenre, true);
  }, [searchQuery, selectedGenre, loadMovies]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadMovies(nextPage, searchQuery, selectedGenre, false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleGenreSelect = (genre: string) => {
    setSelectedGenre(genre);
    setSearchQuery(""); // Clear search when changing genre
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-zinc-900 p-8 rounded-xl border border-zinc-800 shadow-2xl">
          <div className="flex items-center justify-center gap-2 text-red-600 mb-8">
            <Film className="h-10 w-10" />
            <h1 className="text-3xl font-black tracking-tighter">YIFYFLIX</h1>
          </div>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (passwordInput === "MusizFRL5643") {
              setIsAuthenticated(true);
            } else {
              setPasswordError(true);
            }
          }} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Enter Password</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setPasswordError(false);
                }}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                placeholder="Password"
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-2">Incorrect password</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-red-600/30">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full bg-gradient-to-b from-zinc-950/80 to-transparent backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-red-600">
              <Film className="h-8 w-8" />
              <h1 className="text-2xl font-black tracking-tighter">YIFYFLIX</h1>
            </div>
            
            {/* Navigation */}
            <nav className="hidden sm:flex items-center gap-6">
              <button 
                onClick={() => setCurrentView('home')}
                className={`flex items-center gap-2 font-semibold transition-colors ${currentView === 'home' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                <Home className="w-4 h-4" />
                Home
              </button>
              <button 
                onClick={() => setCurrentView('discover')}
                className={`flex items-center gap-2 font-semibold transition-colors ${currentView === 'discover' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                <Compass className="w-4 h-4" />
                Discover
              </button>
            </nav>
          </div>
          <div className="w-full sm:w-auto flex items-center gap-4">
            {/* Mobile Navigation */}
            <nav className="flex sm:hidden items-center gap-4 mr-auto">
              <button 
                onClick={() => setCurrentView('home')}
                className={`transition-colors ${currentView === 'home' ? 'text-white' : 'text-zinc-400'}`}
              >
                <Home className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setCurrentView('discover')}
                className={`transition-colors ${currentView === 'discover' ? 'text-white' : 'text-zinc-400'}`}
              >
                <Compass className="w-5 h-5" />
              </button>
            </nav>
            <SearchBar onSearch={handleSearch} initialQuery={searchQuery} />
          </div>
        </div>
      </header>

      {currentView === 'home' ? (
        <>
          {/* Hero Banner */}
          {!searchQuery && topMovie && (
            <HeroBanner
              movie={topMovie}
              onPlay={setSelectedMovie}
              onMoreInfo={setSelectedMovie}
            />
          )}

          {/* Main Content */}
          <main className={`mx-auto max-w-7xl pb-8 ${!searchQuery && topMovie ? '-mt-24 relative z-10' : 'pt-32'}`}>
            {!searchQuery && (
              <div className="mb-8">
                <Tabs
                  genres={GENRES}
                  selectedGenre={selectedGenre}
                  onSelect={handleGenreSelect}
                />
              </div>
            )}

            <div className="px-4 sm:px-6 lg:px-8">
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
            </div>
          </main>
        </>
      ) : (
        <DiscoverFeed 
          onPlay={setSelectedMovie} 
          onMoreInfo={setSelectedMovie} 
        />
      )}

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
