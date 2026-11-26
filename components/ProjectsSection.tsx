"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface Project {
  title: string;
  text: string;
  tags: string[];
  href: string;
  image: string;
}

const PROJECTS: Project[] = [1, 2, 3, 4, 5, 6].map((n) => ({
  title: `Project ${n}`,
  text: "Korte beschrijving van het project. Vervang deze tekst door wat je hebt gemaakt.",
  tags: ["Next.js", "TypeScript"],
  href: "https://example.com",
  image: `/img/projects/project${n}.jpg`,
}));


function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const [failed, setFailed] = useState(false);

  const backgrounds = [
    "#A4D8C9",
    "#E9DDB7",
    "#F2D9CB",
    "#F1DDB9",
    "#D4C8E9",
    "#C7D9EA",
  ];

  const background = backgrounds[index % backgrounds.length];

  return (
    <article
      className="group relative h-[50vh] w-[calc(50vh*5/7)] max-h-[50vh] shrink-0 overflow-hidden"
      style={{ backgroundColor: background }}
    >
      {/* Header: logo + title */}
      <div className="relative z-10 flex items-center gap-3 p-4 sm:gap-4 sm:p-5">
        {/* Placeholder logo */}
        <div className="flex size-9 shrink-0 items-center justify-center sm:size-11">
          <span className="text-xl font-black text-black/75 sm:text-2xl">
            P
          </span>
        </div>

        {/* Project title */}
        <div className="min-w-0">
          <h3 className="text-base font-black leading-tight text-black/85 sm:text-lg md:text-xl">
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              draggable={false}
            >
              {project.title}
            </a>
          </h3>
        </div>
      </div>

      {/* Full-width image directly below the header */}
      <div className="absolute inset-x-0 bottom-0 top-[76px] overflow-hidden sm:top-[88px]">
        {failed ? (
          <div className="flex h-full w-full items-center justify-center bg-black/10">
            <span className="text-5xl font-black text-black/20">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
        ) : (
          <Image
            src={project.image}
            alt={`${project.title} preview`}
            fill
            draggable={false}
            sizes="(min-width: 1024px) 360px, 70vw"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
            onError={() => setFailed(true)}
          />
        )}
      </div>
    </article>
  );
}


export default function ProjectsSection() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const moved = useRef(false);
  const draggingRef = useRef(false);
  const velocityRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const loopWidthRef = useRef(0);

  const [dragging, setDragging] = useState(false);

  // Start in the middle copy, so the carousel can loop in both directions.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const children = el.children;

    if (children.length >= PROJECTS.length * 2) {
      const firstCard = children[0] as HTMLElement;
      const middleFirstCard = children[PROJECTS.length] as HTMLElement;

      const loopWidth = middleFirstCard.offsetLeft - firstCard.offsetLeft;

      loopWidthRef.current = loopWidth;
      el.scrollLeft = loopWidth;
    }
  }, []);

  // Keep the scroll position inside the middle copy.
  // This makes the carousel appear infinite.
  const handleLoop = () => {
    const el = scrollerRef.current;
    const loopWidth = loopWidthRef.current;

    if (!el || !loopWidth) return;

    if (el.scrollLeft < loopWidth * 0.5) {
      el.scrollLeft += loopWidth;
    } else if (el.scrollLeft > loopWidth * 1.5) {
      el.scrollLeft -= loopWidth;
    }
  };

  // Smooth momentum after releasing the mouse.
  const startMomentum = () => {
    const el = scrollerRef.current;
    if (!el) return;

    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
    }

    const animate = () => {
      const currentVelocity = velocityRef.current;

      // Stop when the movement becomes almost imperceptible.
      if (Math.abs(currentVelocity) < 0.15) {
        velocityRef.current = 0;
        animationRef.current = null;
        return;
      }

      el.scrollLeft += currentVelocity;
      handleLoop();

      // Friction: smaller multiplier = faster slowdown.
      velocityRef.current *= 0.95;

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;

    if (!el || e.button !== 0) return;

    // Stop any existing momentum when starting a new drag.
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    const startX = e.clientX;
    const startLeft = el.scrollLeft;

    let lastX = e.clientX;
    let lastTime = performance.now();

    velocityRef.current = 0;
    moved.current = false;
    draggingRef.current = true;

    setDragging(true);

    const onMove = (ev: MouseEvent) => {
      const now = performance.now();
      const dx = ev.clientX - startX;

      if (Math.abs(dx) > 5) {
        moved.current = true;
      }

      // Drag position.
      el.scrollLeft = startLeft - dx;

      // Calculate release velocity.
      const deltaX = ev.clientX - lastX;
      const deltaTime = Math.max(now - lastTime, 1);

      velocityRef.current = -(deltaX / deltaTime) * 16;

      lastX = ev.clientX;
      lastTime = now;

      handleLoop();
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);

      draggingRef.current = false;
      setDragging(false);

      // Continue moving using the last drag velocity.
      startMomentum();
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  // Clean up the animation if the component unmounts.
  useEffect(() => {
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <section
      aria-labelledby="projects-title"
      className="mt-10 sm:mt-12 md:mt-16"
    >
      <h2
        id="projects-title"
        className="text-2xl font-bold sm:text-3xl md:text-4xl"
      >
        Projecten
      </h2>

      <div
        ref={scrollerRef}
        role="region"
        aria-label="Projecten, sleep of scrol naar links en rechts"
        tabIndex={0}
        onMouseDown={onMouseDown}
        onScroll={handleLoop}
        onDragStart={(e) => e.preventDefault()}
        onClickCapture={(e) => {
          if (moved.current) {
            e.preventDefault();
            e.stopPropagation();
            moved.current = false;
          }
        }}
        className={`-mx-4 mt-8 flex gap-8 overflow-x-auto px-4 py-1 [scrollbar-width:none] sm:-mx-8 sm:px-8 md:-mx-16 md:px-16 lg:-mx-24 lg:px-24 [&::-webkit-scrollbar]:hidden ${
          dragging ? "cursor-grabbing select-none" : "cursor-grab"
        } outline-none`}
      >
        {/* Three copies allow seamless looping in both directions. */}
        {[0, 1, 2].map((copy) =>
          PROJECTS.map((project, i) => (
            <ProjectCard
              key={`${copy}-${project.title}`}
              project={project}
              index={i}
            />
          )),
        )}
      </div>
    </section>
  );
}
