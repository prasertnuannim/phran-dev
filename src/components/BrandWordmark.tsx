// Colors follow the visible letters in “Phran Dev”; the space has no color.
const defaultLetterColors = [
  "#203b61", // P
  "#284e7a", // h
  "#2d618e", // r
  "#32739f", // a
  "#3684ad", // n
  "#2766a6", // D
  "#357eb5", // e
  "#408fae", // v
];

export default function BrandWordmark({ colors = defaultLetterColors }: {
  colors?: readonly string[];
}) {
  let colorIndex = 0;

  return (
    <span className="brand-wordmark" role="img" aria-label="Phran Dev">
      <span aria-hidden="true">
        {Array.from("Phran Dev").map((letter, index) => {
          if (letter === " ") return " ";
          const letterIndex = colorIndex++;
          return <span key={index} className="brand-wordmark-letter" style={{ color: colors[letterIndex] ?? defaultLetterColors[letterIndex], animationDelay: `${letterIndex * -0.3}s` }}>{letter}</span>;
        })}
      </span>
    </span>
  );
}
