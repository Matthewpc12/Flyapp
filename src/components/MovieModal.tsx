import React, { useState, useEffect } from "react";
import { Movie } from "../types";
import { X, Star, Clock, Calendar, Play, Download } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface MovieModalProps {
  movie: Movie | null;
  onClose: () => void;
}

export const MovieModal: React.FC<MovieModalProps> = ({ movie, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedServer, setSelectedServer] = useState<string>('vidsrc');

  const servers = [
    { id: 'vidsrc', name: 'Server 1 (VidSrc)', url: (imdb: string) => `https://vidsrc.to/embed/movie/${imdb}` },
    { id: 'vidlink', name: 'Server 2 (VidLink)', url: (imdb: string) => `https://vidlink.pro/movie/${imdb}` },
    { id: 'embedsu', name: 'Server 3 (Embed.su)', url: (imdb: string) => `https://embed.su/embed/movie/${imdb}` },
    { id: 'autoembed', name: 'Server 4 (AutoEmbed)', url: (imdb: string) => `https://autoembed.to/movie/imdb/${imdb}` },
    { id: 'multiembed', name: 'Server 5 (MultiEmbed)', url: (imdb: string) => `https://multiembed.mov/directstream.php?video_id=${imdb}` },
    { id: '2embed', name: 'Server 6 (2Embed)', url: (imdb: string) => `https://www.2embed.cc/embed/${imdb}` },
  ];

  useEffect(() => {
    if (movie) {
      document.body.style.overflow = "hidden";
      setIsPlaying(false);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [movie]);

  if (!movie) return null;

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const currentServerUrl = servers.find(s => s.id === selectedServer)?.url(movie.imdb_code) || servers[0].url(movie.imdb_code);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6 sm:px-6 z-[100]"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative max-h-full w-full max-w-5xl overflow-hidden rounded-xl bg-zinc-900 shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-20 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/80"
          >
            <X className="h-6 w-6" />
          </button>

          {isPlaying ? (
            <div className="relative w-full aspect-video bg-black flex flex-col">
              <div className="absolute top-4 right-16 z-10 flex items-center gap-2">
                <span className="text-xs font-medium text-white/70 bg-black/40 px-2 py-1 rounded backdrop-blur-sm">Server:</span>
                <select 
                  value={selectedServer}
                  onChange={(e) => setSelectedServer(e.target.value)}
                  className="bg-black/60 text-white text-sm rounded px-2 py-1 border border-white/20 backdrop-blur-sm focus:outline-none focus:border-white/40"
                >
                  {servers.map(s => (
                    <option key={s.id} value={s.id} className="bg-zinc-900">{s.name}</option>
                  ))}
                </select>
              </div>
              <iframe
                src={currentServerUrl}
                className="w-full h-full border-0"
                allowFullScreen
                allow="autoplay; fullscreen"
                title={movie.title}
              ></iframe>
              <div className="absolute top-4 left-4 z-10">
                <button 
                  onClick={() => setIsPlaying(false)}
                  className="rounded bg-black/60 px-4 py-2 text-sm font-semibold text-white hover:bg-black/80 transition-colors backdrop-blur-sm"
                >
                  ← Back to Details
                </button>
              </div>
            </div>
          ) : (
            <div className="flex h-full max-h-[90vh] flex-col overflow-y-auto">
              {/* Hero Image */}
              <div className="relative h-64 w-full shrink-0 sm:h-96">
                <img
                  src={
                    movie.background_image_original ||
                    movie.background_image ||
                    movie.large_cover_image
                  }
                  alt={movie.title}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "https://picsum.photos/seed/moviebg/1920/1080?blur=10";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />

                <div className="absolute bottom-0 left-0 p-6 sm:p-8 w-full">
                  <h2 className="text-3xl font-bold text-white sm:text-5xl">
                    {movie.title}
                  </h2>
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-zinc-300 sm:text-base">
                    <span className="flex items-center gap-1 font-semibold text-green-500">
                      <Star className="h-4 w-4 fill-current" />
                      {movie.rating} Rating
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {movie.year}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {movie.runtime} min
                    </span>
                    {movie.mpa_rating && (
                      <span className="rounded border border-zinc-600 px-2 py-0.5 text-xs font-medium uppercase">
                        {movie.mpa_rating}
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-6 flex gap-4">
                    <button
                      onClick={handlePlay}
                      className="flex items-center gap-2 rounded-md bg-red-600 px-6 py-3 font-bold text-white transition-colors hover:bg-red-700 shadow-lg shadow-red-600/20"
                    >
                      <Play className="h-5 w-5 fill-current" />
                      Play Movie
                    </button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col gap-8 p-6 sm:p-8 md:flex-row">
                <div className="flex-1 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Synopsis</h3>
                    <p className="mt-2 text-zinc-400 leading-relaxed">
                      {movie.description_full ||
                        movie.summary ||
                        movie.synopsis ||
                        "No synopsis available."}
                    </p>
                  </div>

                  {movie.yt_trailer_code && (
                    <div>
                      <a
                        href={`https://www.youtube.com/watch?v=${movie.yt_trailer_code}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-md bg-white/10 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/20"
                      >
                        <Play className="h-5 w-5 fill-current" />
                        Watch Trailer
                      </a>
                    </div>
                  )}
                </div>

                <div className="w-full shrink-0 space-y-6 md:w-64">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-500">
                      Genres
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {movie.genres?.map((genre) => (
                        <span
                          key={genre}
                          className="rounded-full bg-zinc-800 px-3 py-1 text-sm text-zinc-300"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-zinc-500">
                      Language
                    </h3>
                    <p className="mt-1 text-zinc-300 uppercase">
                      {movie.language}
                    </p>
                  </div>

                  {movie.torrents && movie.torrents.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-500 mb-2">
                        Available Streams & Downloads
                      </h3>
                      <div className="flex flex-col gap-2">
                        {movie.torrents.map((torrent, idx) => (
                          <div key={idx} className="flex items-center justify-between rounded bg-zinc-800 px-3 py-2 text-sm text-zinc-300">
                            <div className="flex flex-col">
                              <span className="font-medium text-white">{torrent.quality} {torrent.type}</span>
                              <span className="text-xs text-zinc-500">{torrent.size}</span>
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={handlePlay}
                                className="p-2 rounded hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                                title="Stream"
                              >
                                <Play className="h-4 w-4" />
                              </button>
                              <a 
                                href={torrent.url}
                                className="p-2 rounded hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                                title="Download Torrent"
                              >
                                <Download className="h-4 w-4" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
