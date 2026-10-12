import type { Movie } from "../../types";

// No poster images in the data model, so each movie gets a typographic poster
// whose colour is derived from its genre.
const palettes = [
  "bg-ink text-white",
  "bg-velvet text-white",
  "bg-[#1f4e5a] text-white",
  "bg-[#4b2a5e] text-white",
  "bg-[#7a5a14] text-white",
  "bg-[#2d4a2b] text-white",
];

function paletteFor(key: string) {
  let hash = 0;
  for (const ch of key.toLowerCase()) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return palettes[hash % palettes.length];
}

export default function MoviePoster({ movie, size = "md" }: { movie: Movie; size?: "md" | "lg" }) {
  return (
    <div className={`relative flex aspect-[2/3] flex-col justify-between overflow-hidden rounded-lg p-4 ${paletteFor(movie.genre)}`}>
      <span className="text-xs font-medium text-white/70">{movie.genre}</span>
      <h3 className={`font-display font-extrabold leading-[0.95] break-words ${size === "lg" ? "text-4xl" : "text-2xl"}`}>
        {movie.title}
      </h3>
      <span className="text-xs font-medium text-white/70">{movie.language}</span>
      <span className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full border-[10px] border-white/10" aria-hidden />
    </div>
  );
}
