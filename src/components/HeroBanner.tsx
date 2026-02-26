import React from "react";
import { Movie } from "../types";
import { Play, Info, Star } from "lucide-react";

interface HeroBannerProps {
  movie: Movie;
  onPlay: (movie: Movie) => void;
  onMoreInfo: (movie: Movie) => void;
}

export function HeroBanner({ movie, onPlay, onMoreInfo }: HeroBannerProps) {
  return (
    <div className="relative w-full h-[70vh] sm:h-[80vh] bg-zinc-900 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={movie.background_image_original || movie.background_image}
          alt={movie.title}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-24 sm:pb-32">
        <div className="max-w-2xl space-y-4">
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight drop-shadow-lg">
            {movie.title}
          </h1>
          
          <div className="flex items-center gap-4 text-sm font-medium text-zinc-300">
            <span className="flex items-center gap-1 text-yellow-500">
              <Star className="w-4 h-4 fill-current" />
              {movie.rating}
            </span>
            <span>{movie.year}</span>
            <span>{movie.runtime} min</span>
            <div className="flex gap-2">
              {movie.genres?.slice(0, 3).map((genre) => (
                <span
                  key={genre}
                  className="px-2 py-0.5 rounded-md bg-zinc-800/80 text-xs border border-zinc-700"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>

          <p className="text-lg text-zinc-300 line-clamp-3 drop-shadow-md">
            {movie.summary || movie.description_full}
          </p>

          <div className="flex items-center gap-4 pt-4">
            <button
              onClick={() => onPlay(movie)}
              className="flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded-md hover:bg-zinc-200 transition-colors"
            >
              <Play className="w-5 h-5 fill-current" />
              Play
            </button>
            <button
              onClick={() => onMoreInfo(movie)}
              className="flex items-center gap-2 px-8 py-3 bg-zinc-500/50 text-white font-bold rounded-md hover:bg-zinc-500/70 transition-colors backdrop-blur-sm"
            >
              <Info className="w-5 h-5" />
              More Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
