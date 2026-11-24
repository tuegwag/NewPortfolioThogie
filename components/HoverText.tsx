"use client";

import { Fragment, useState } from "react";

const SCALES = [1.6, 1.3, 1.12];
const STAGGER = 50; // ms between letters

export default function HoverText({ text }: { text: string }) {
  const [hovered, setHovered] = useState<number | null>(null);

  const getScale = (index: number) => {
    if (hovered === null) return 1;
    return SCALES[Math.abs(index - hovered)] ?? 1;
  };

  let index = 0;

  return (
    <span aria-label={text} onMouseLeave={() => setHovered(null)}>
      {text.split(" ").map((word, w) => {
        const start = index;
        index += word.length + 1;
        return (
          <Fragment key={w}>
            {w > 0 && " "}
            <span aria-hidden="true" className="inline-block whitespace-nowrap">
              {word.split("").map((char, c) => (
                <span
                  key={c}
                  className="wave-in inline-block"
                  style={{ animationDelay: `${(start + c) * STAGGER}ms` }}
                >
                  <span
                    onMouseEnter={() => setHovered(start + c)}
                    className="inline-block transition-transform duration-200 ease-out"
                    style={{ transform: `scale(${getScale(start + c)})` }}
                  >
                    {char}
                  </span>
                </span>
              ))}
            </span>
          </Fragment>
        );
      })}
    </span>
  );
}