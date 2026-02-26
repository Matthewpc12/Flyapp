import React, { useState, useEffect, useRef, useCallback } from 'react';
import { fetchMovies } from '../services/ytsApi';
import { Movie } from '../types';
import { Play, Info, Star, Volume2, VolumeX, Loader2 } from 'lucide-react';

interface DiscoverFeedProps {
  onPlay: (movie: Movie) => void;
  onMoreInfo: (movie: Movie) => void;
}

export function DiscoverFeed({ onPlay, onMoreInfo }: DiscoverFeedProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const loadMoreMovies = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      // Fetch highly rated movies for the discover feed
      const response = await fetchMovies({ page, limit: 20, sortBy: 'rating' });
      if (response.status === 'ok' && response.data.movies) {
        // Only keep movies that have a YouTube trailer
        const withTrailers = response.data.movies.filter(m => m.yt_trailer_code);
        setMovies(prev => {
          const newMovies = withTrailers.filter(m => !prev.find(p => p.id === m.id));
          return [...prev, ...newMovies];
        });
        setPage(p => p + 1);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, loading]);

  useEffect(() => {
    loadMoreMovies();
  }, []);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const index = Number(entry.target.getAttribute('data-index'));
        setActiveIndex(index);
        // Load more when we get close to the end
        if (index >= movies.length - 3) {
          loadMoreMovies();
        }
      }
    });
  }, [movies.length, loadMoreMovies]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleObserver, {
      threshold: 0.6,
    });
    return () => observerRef.current?.disconnect();
  }, [handleObserver]);

  const itemRef = useCallback((node: HTMLDivElement | null) => {
    if (node && observerRef.current) {
      observerRef.current.observe(node);
    }
  }, []);

  if (movies.length === 0 && loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-zinc-950">
        <Loader2 className="w-10 h-10 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory bg-black scroll-smooth">
      {movies.map((movie, index) => {
        const isActive = index === activeIndex;
        return (
          <div 
            key={`${movie.id}-${index}`} 
            ref={itemRef}
            data-index={index}
            className="relative h-screen w-full snap-start snap-always bg-zinc-900 flex items-center justify-center overflow-hidden"
          >
            {/* Video Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden bg-black">
              {Math.abs(activeIndex - index) <= 1 ? (
                <iframe
                  src={`https://www.youtube.com/embed/${movie.yt_trailer_code}?autoplay=${isActive ? 1 : 0}&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${movie.yt_trailer_code}&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&fs=0&disablekb=1`}
                  className="w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-70"
                  allow="autoplay; encrypted-media"
                  style={{ border: 'none' }}
                />
              ) : (
                <img 
                  src={movie.background_image_original || movie.large_cover_image} 
                  alt={movie.title}
                  className="w-full h-full object-cover opacity-40"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/40 to-zinc-950" />
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/80 via-transparent to-transparent" />
            </div>

            {/* Overlay UI */}
            <div className="absolute bottom-0 left-0 w-full p-6 pb-24 sm:pb-12 sm:px-12 flex flex-col justify-end z-10">
              <div className="max-w-3xl flex flex-col gap-4">
                <h2 className="text-4xl sm:text-6xl font-black text-white drop-shadow-2xl">{movie.title}</h2>
                
                <div className="flex items-center gap-4 text-sm sm:text-base font-medium text-zinc-300">
                  <span className="flex items-center gap-1 text-yellow-500 bg-black/40 px-2 py-1 rounded-md backdrop-blur-sm">
                    <Star className="w-4 h-4 fill-current" />
                    {movie.rating}
                  </span>
                  <span className="bg-black/40 px-2 py-1 rounded-md backdrop-blur-sm">{movie.year}</span>
                  <div className="flex gap-2">
                    {movie.genres?.slice(0, 3).map(g => (
                      <span key={g} className="px-2 py-1 rounded-md bg-white/10 backdrop-blur-sm text-xs text-white border border-white/10">{g}</span>
                    ))}
                  </div>
                </div>

                <p className="text-zinc-300 text-sm sm:text-lg line-clamp-3 drop-shadow-md max-w-2xl font-medium">
                  {movie.summary || movie.description_full}
                </p>

                <div className="flex items-center gap-4 mt-4">
                  <button 
                    onClick={() => onPlay(movie)}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold transition-transform active:scale-95 shadow-lg shadow-red-600/20 text-lg"
                  >
                    <Play className="w-6 h-6 fill-current" />
                    Watch Movie
                  </button>
                  <button 
                    onClick={() => onMoreInfo(movie)}
                    className="flex items-center gap-2 bg-zinc-800/80 hover:bg-zinc-700 text-white px-8 py-4 rounded-full font-bold backdrop-blur-sm transition-transform active:scale-95 border border-zinc-700 text-lg"
                  >
                    <Info className="w-6 h-6" />
                    Details
                  </button>
                </div>
              </div>
            </div>

            {/* Mute Toggle */}
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="absolute top-32 right-6 sm:right-12 z-20 p-4 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-colors border border-white/10"
            >
              {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </button>
          </div>
        );
      })}
      {loading && movies.length > 0 && (
        <div className="h-32 w-full snap-start flex items-center justify-center bg-zinc-950">
          <Loader2 className="w-8 h-8 animate-spin text-red-600" />
        </div>
      )}
    </div>
  );
}
