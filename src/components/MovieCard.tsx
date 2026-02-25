import React from "react";
import { Movie } from "../types";
import { Star } from "lucide-react";

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  return (
    <div
      className="group relative cursor-pointer overflow-hidden rounded-md transition-transform duration-300 hover:scale-105 hover:z-10"
      onClick={() => onClick(movie)}
    >
      <div className="aspect-[2/3] w-full bg-zinc-800">
        <img
          src={movie.medium_cover_image}
          alt={movie.title}
          loading="lazy"
          className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-40"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://picsum.photos/seed/movie/400/600?blur=10"; // Fallback image
          }}
        />
      </div>

      <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
        <h3 className="text-lg font-bold text-white line-clamp-2">
          {movie.title}
        </h3>
        <div className="mt-2 flex items-center gap-2 text-sm text-zinc-300">
          <span>{movie.year}</span>
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
            {movie.rating}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {movie.genres?.slice(0, 2).map((genre) => (
            <span
              key={genre}
              className="rounded-full bg-zinc-700/50 px-2 py-0.5 text-xs text-zinc-300"
            >
              {genre}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
