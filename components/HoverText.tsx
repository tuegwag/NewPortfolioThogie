"use client";

import { Fragment, useState } from "react";

const SCALES = [1.6, 1.3, 1.12];

export default function HoverText({ text }: { text: string }) {
  const [hovered, setHovered] = useState<number | null>(null);

  const getScale = (index: number) => {
    if (hovered === null) return 1;
    return SCALES[Math.abs(index - hovered)] ?? 1;
  };

  const words = text.split(" ");
  const wordOffsets = words.map((_, wordIndex) =>
    words
      .slice(0, wordIndex)
      .reduce((offset, word) => offset + word.length + 1, 0),
  );

  return (
    <span aria-label={text} onMouseLeave={() => setHovered(null)}>
      {words.map((word, w) => {
        const start = wordOffsets[w];
        return (
          <Fragment key={w}>
            {w > 0 && " "}
            <span aria-hidden="true" className="inline-block whitespace-nowrap">
              {word.split("").map((char, c) => (
                <span
                  key={c}
                  onMouseEnter={() => setHovered(start + c)}
                  className="inline-block transition-transform duration-200 ease-out"
                  style={{ transform: `scale(${getScale(start + c)})` }}
                >
                  {char}
                </span>
              ))}
            </span>
          </Fragment>
        );
      })}
    </span>
  );
}