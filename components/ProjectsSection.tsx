"use client";

import Image from "next/image";
import { useRef, useState } from "react";

interface Project {
  title: string;
  text: string;
  tags: string[];
  href: string; // where the card links to
  image: string; // file in public/, for example public/img/projects/project1.jpg
}

// Placeholders: replace the text, links and images with your own projects.
// Add or remove projects here and the carousel follows.
const PROJECTS: Project[] = [1, 2, 3, 4, 5, 6].map((n) => ({
  title: `Project ${n}`,
  text: "Korte beschrijving van het project. Vervang deze tekst door wat je hebt gemaakt.",
  tags: ["Next.js", "TypeScript"],
  href: "https://example.com",
  image: `/img/projects/project${n}.jpg`,
}));

function ProjectCard({ project, index }: { project: Project; index: number }) {
  // If the image is missing, show a plain block with the number instead.
  const [failed, setFailed] = useState(false);

  return (
    <article className="group relative flex aspect-[2/3] w-[70vw] max-w-72 shrink-0 snap-start flex-col overflow-hidden rounded-2xl bg-white/10 sm:w-72 lg:max-w-80">
      <div className="relative flex-[3] overflow-hidden bg-white/5">
        {failed ? (
          <div className="flex h-full items-center justify-center text-5xl font-bold text-white/30">
            {String(index + 1).padStart(2, "0")}
          </div>
        ) : (
          <Image
            src={project.image}
            alt=""
            fill
            draggable={false}
            sizes="(min-width: 1024px) 20rem, 18rem"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setFailed(true)}
          />
        )}
      </div>

      <div className="flex flex-[2] flex-col gap-2 p-4 sm:p-5">
        <h3 className="text-lg font-bold sm:text-xl">
          {/* The link covers the whole card, so the whole card is clickable. */}
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            draggable={false}
            className="outline-none after:absolute after:inset-0 focus-visible:after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-white/60"
          >
            {project.title}
          </a>
        </h3>
        <p className="line-clamp-3 text-sm text-white/70 sm:text-base">
          {project.text}
        </p>
        <ul className="mt-auto flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-white/15 px-2.5 py-1 text-xs sm:text-sm"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default function ProjectsSection() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const moved = useRef(false); // true if the last mouse press turned into a drag
  const [dragging, setDragging] = useState(false);

  // Mouse: press and drag to scroll sideways. (Touch already scrolls sideways
  // by itself, and trackpads and the arrow keys work too.)
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (!el || e.button !== 0) return;

    const startX = e.clientX;
    const startLeft = el.scrollLeft;
    moved.current = false;
    setDragging(true);
    el.style.scrollSnapType = "none"; // no snapping while dragging, it fights the drag

    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX;
      if (Math.abs(dx) > 5) moved.current = true;
      el.scrollLeft = startLeft - dx;
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      el.style.scrollSnapType = ""; // snap to the nearest card again
      setDragging(false);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <section aria-labelledby="projects-title" className="mt-10 sm:mt-12 md:mt-16">
      <h2
        id="projects-title"
        className="text-2xl font-bold sm:text-3xl md:text-4xl"
      >
        Projecten
      </h2>

      {/* The carousel runs to the edges of the screen; the first card lines up
          with the rest of the page thanks to the matching padding. */}
      <div
        ref={scrollerRef}
        role="region"
        aria-label="Projecten, sleep of scrol naar links en rechts"
        tabIndex={0}
        onMouseDown={onMouseDown}
        onDragStart={(e) => e.preventDefault()}
        // A drag must not count as a click on a card.
        onClickCapture={(e) => {
          if (moved.current) {
            e.preventDefault();
            e.stopPropagation();
            moved.current = false;
          }
        }}
        className={`-mx-4 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 py-1 [scroll-padding-inline:1rem] [scrollbar-width:none] sm:-mx-8 sm:gap-5 sm:px-8 sm:[scroll-padding-inline:2rem] md:-mx-16 md:px-16 md:[scroll-padding-inline:4rem] lg:-mx-24 lg:px-24 lg:[scroll-padding-inline:6rem] [&::-webkit-scrollbar]:hidden ${
          dragging ? "cursor-grabbing select-none" : "cursor-grab"
        } outline-none focus-visible:ring-2 focus-visible:ring-white/60`}
      >
        {PROJECTS.map((project, i) => (
          <ProjectCard key={project.title} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}