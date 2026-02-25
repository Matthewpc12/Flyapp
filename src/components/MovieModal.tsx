import React, { useEffect } from "react";
import { Movie } from "../types";
import { X, Star, Clock, Calendar, Play } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface MovieModalProps {
  movie: Movie | null;
  onClose: () => void;
}

export const MovieModal: React.FC<MovieModalProps> = ({ movie, onClose }) => {
  useEffect(() => {
    if (movie) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [movie]);

  if (!movie) return null;

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
          className="relative max-h-full w-full max-w-4xl overflow-hidden rounded-xl bg-zinc-900 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/80"
          >
            <X className="h-6 w-6" />
          </button>

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
                      className="inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 font-semibold text-black transition-colors hover:bg-zinc-200"
                    >
                      <Play className="h-5 w-5 fill-current" />
                      Play Trailer
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
                      Available Downloads
                    </h3>
                    <div className="flex flex-col gap-2">
                      {movie.torrents.map((torrent, idx) => (
                        <a
                          key={idx}
                          href={torrent.url}
                          className="flex items-center justify-between rounded bg-zinc-800 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors"
                        >
                          <span>
                            {torrent.quality} {torrent.type}
                          </span>
                          <span className="text-xs text-zinc-500">
                            {torrent.size}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
