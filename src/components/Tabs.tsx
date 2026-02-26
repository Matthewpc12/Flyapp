import React from "react";

interface TabsProps {
  genres: string[];
  selectedGenre: string;
  onSelect: (genre: string) => void;
}

export function Tabs({ genres, selectedGenre, onSelect }: TabsProps) {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide border-b border-zinc-800">
      <div className="flex gap-6 px-4 sm:px-6 lg:px-8 py-4 whitespace-nowrap">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => onSelect(genre)}
            className={`text-sm font-medium transition-colors relative ${
              selectedGenre === genre
                ? "text-white"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {genre}
            {selectedGenre === genre && (
              <span className="absolute -bottom-4 left-0 right-0 h-0.5 bg-red-600 rounded-t-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
