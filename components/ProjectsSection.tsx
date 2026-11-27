"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface Project {
  title: string;
  text: string;
  tags: string[];
  href: string;
  image: string;
  logo: string;
}

interface CardRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const PROJECTS: Project[] = [
  {
    title: "mijn Portfolio",
    text: "Een portfolio om mijzelf en mijn skills tentoon te stellen.",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    href: "/",
    image: "/projects/imgProjects/Portfolio.png",
    logo: "P",
  },
  {
    title: "Game, In The Hunt",
    text: "Een kleine game gebaseerd op een spel uit 1993 waarin je tegenstanders moet neerknallen terwijl je jezelf in leven moet houden.",
    tags: ["Html 5", "CSS", "Javascript"],
    href: "/projects/theProjects/inTheHunt/index.html",
    image: "/projects/imgProjects/InTheHunt.jpg",
    logo: "/projects/logoProjects/playersub1.svg",
  },
  {
    title: "GameCraft",
    text: "Een groepsopdracht waarin wij onze games die wij in deze periode gemaakt hebben tentoonstellen.",
    tags: ["HTML", "CSS", "JavaScript"],
    href: "/projects/theProjects/GameCraft/index.html",
    image: "/projects/imgProjects/GameCraft.png",
    logo: "/projects/logoProjects/GameCraftLogo.png",
  },
];

const BACKGROUNDS = [
  "#A4D8C9",
  "#E9DDB7",
  "#F2D9CB",
  "#F1DDB9",
  "#D4C8E9",
  "#C7D9EA",
];

function ProjectCard({
  project,
  index,
  onSelect,
}: {
  project: Project;
  index: number;
  onSelect: (project: Project, element: HTMLElement) => void;
}) {
  const [failed, setFailed] = useState(false);
  const background = BACKGROUNDS[index % BACKGROUNDS.length];

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`Bekijk ${project.title}`}
      onClick={(event) => onSelect(project, event.currentTarget)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(project, event.currentTarget);
        }
      }}
      className="group relative h-[50vh] max-h-[520px] min-h-[320px] w-[clamp(228px,35.714vh,372px)] shrink-0 cursor-pointer overflow-hidden outline-none"
      style={{ backgroundColor: background }}
    >
      <div className="relative z-10 flex items-center gap-3 p-4 sm:gap-4 sm:p-5">
        <div className="flex size-9 shrink-0 items-center justify-center sm:size-11">
          {project.logo === "P" ? (
            <span className="text-xl font-black text-black/75 sm:text-2xl">
              P
            </span>
          ) : (
            <Image
              src={project.logo}
              alt={`${project.title} logo`}
              width={44}
              height={44}
              className="size-full object-contain"
            />
          )}
        </div>

        <h3 className="text-base font-black leading-tight text-black/85 sm:text-lg md:text-xl">
          {project.title}
        </h3>
      </div>

      <div className="absolute inset-x-0 bottom-0 top-[76px] overflow-hidden sm:top-[88px]">
        {failed ? (
          <div className="flex h-full w-full flex-col items-center justify-center bg-black/10">
            <span className="text-6xl font-black text-black/20">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="mt-2 text-xs font-semibold uppercase tracking-widest text-black/35">
              Preview unavailable
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
  const velocityRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const loopWidthRef = useRef(0);
  const moved = useRef(false);

  const [dragging, setDragging] = useState(false);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedRect, setSelectedRect] = useState<CardRect | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const first = el.children[0] as HTMLElement | undefined;
    const middle = el.children[PROJECTS.length] as HTMLElement | undefined;

    if (!first || !middle) return;

    const loopWidth = middle.offsetLeft - first.offsetLeft;
    loopWidthRef.current = loopWidth;
    el.scrollLeft = loopWidth;
  }, []);

  const handleLoop = () => {
    const el = scrollerRef.current;
    const width = loopWidthRef.current;

    if (!el || !width) return;

    if (el.scrollLeft < width * 0.5) {
      el.scrollLeft += width;
    } else if (el.scrollLeft > width * 1.5) {
      el.scrollLeft -= width;
    }
  };

  const startMomentum = () => {
    const el = scrollerRef.current;
    if (!el) return;

    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
    }

    const animate = () => {
      const velocity = velocityRef.current;

      if (Math.abs(velocity) < 0.15) {
        velocityRef.current = 0;
        animationRef.current = null;
        return;
      }

      el.scrollLeft += velocity;
      handleLoop();

      velocityRef.current *= 0.95;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;

    if (!el || event.button !== 0 || selectedProject) return;

    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    const startX = event.clientX;
    const startLeft = el.scrollLeft;

    let lastX = event.clientX;
    let lastTime = performance.now();

    velocityRef.current = 0;
    moved.current = false;

    setDragging(true);

    const onMove = (moveEvent: MouseEvent) => {
      const now = performance.now();
      const dx = moveEvent.clientX - startX;

      if (Math.abs(dx) > 5) moved.current = true;

      el.scrollLeft = startLeft - dx;

      const deltaX = moveEvent.clientX - lastX;
      const deltaTime = Math.max(now - lastTime, 1);

      velocityRef.current = -(deltaX / deltaTime) * 16;

      lastX = moveEvent.clientX;
      lastTime = now;

      handleLoop();
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);

      setDragging(false);
      startMomentum();
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const openProject = (project: Project, element: HTMLElement) => {
    if (moved.current || selectedProject) return;

    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    const rect = element.getBoundingClientRect();

    setSelectedRect({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    });

    setSelectedProject(project);
    setExpanded(false);
    setDetailsVisible(false);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setExpanded(true);
      });
    });
  };

  const closeProject = () => {
    setDetailsVisible(false);
    setExpanded(false);
  };

  useEffect(() => {
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!selectedProject) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedProject]);

  const selectedIndex = selectedProject
    ? PROJECTS.findIndex((project) => project.title === selectedProject.title)
    : 0;

  const selectedBackground =
    BACKGROUNDS[Math.max(selectedIndex, 0) % BACKGROUNDS.length];

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
        aria-label="Projecten, sleep of scroll naar links en rechts"
        tabIndex={0}
        onMouseDown={onMouseDown}
        onScroll={handleLoop}
        onDragStart={(event) => event.preventDefault()}
        onClickCapture={(event) => {
          if (moved.current) {
            event.preventDefault();
            event.stopPropagation();
            moved.current = false;
          }
        }}
        className={`-mx-4 mt-8 flex gap-8 overflow-x-auto px-4 py-1 [scrollbar-width:none] sm:-mx-8 sm:px-8 md:-mx-16 md:px-16 lg:-mx-24 lg:px-24 [&::-webkit-scrollbar]:hidden ${
          dragging ? "cursor-grabbing select-none" : "cursor-grab"
        } outline-none`}
      >
        {[0, 1, 2].map((copy) =>
          PROJECTS.map((project, index) => (
            <ProjectCard
              key={`${copy}-${project.title}`}
              project={project}
              index={index}
              onSelect={openProject}
            />
          )),
        )}
      </div>

      {selectedProject && selectedRect && (
        <div
          className="fixed z-[100] overflow-hidden"
          onTransitionEnd={(event) => {
            if (
              event.target !== event.currentTarget ||
              event.propertyName !== "width"
            ) {
              return;
            }

            if (expanded) {
              setDetailsVisible(true);
            } else {
              setSelectedProject(null);
              setSelectedRect(null);
              setDetailsVisible(false);
            }
          }}
          style={{
            top: expanded ? 0 : selectedRect.top,
            left: expanded ? 0 : selectedRect.left,
            width: expanded ? "100vw" : selectedRect.width,
            height: expanded ? "100dvh" : selectedRect.height,
            backgroundColor: selectedBackground,
            transition:
              "top 750ms cubic-bezier(0.22, 1, 0.36, 1), left 750ms cubic-bezier(0.22, 1, 0.36, 1), width 750ms cubic-bezier(0.22, 1, 0.36, 1), height 750ms cubic-bezier(0.22, 1, 0.36, 1)",
            overscrollBehavior: "contain",
          }}
        >
          <div
            className="mx-auto flex min-h-full w-full max-w-[1440px] flex-col px-6 py-6 sm:px-10 sm:py-8 lg:px-16 lg:py-10"
            style={{
              opacity: detailsVisible ? 1 : 0,
              transform: detailsVisible ? "translateY(0)" : "translateY(18px)",
              transition: "opacity 450ms ease, transform 550ms ease",
              transitionDelay: detailsVisible ? "100ms" : "0ms",
              pointerEvents: detailsVisible ? "auto" : "none",
            }}
          >
            <div className="flex shrink-0 items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-black/45 sm:text-sm">
                Selected work
              </span>

              <button
                type="button"
                onClick={closeProject}
                aria-label="Close project"
                className="flex size-11 items-center justify-center border border-black/30 text-2xl text-black transition-colors hover:bg-black hover:text-white sm:size-12"
              >
                ×
              </button>
            </div>

            <div className="grid flex-1 grid-cols-1 items-center gap-8 py-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 xl:gap-20">
              <div className="flex flex-col items-start">
                <div className="mb-6 flex size-12 items-center justify-center sm:mb-8 sm:size-14">
                  {selectedProject.logo === "P" ? (
                    <div className="flex size-full items-center justify-center border-2 border-black text-2xl font-black text-black sm:text-3xl">
                      P
                    </div>
                  ) : (
                    <Image
                      src={selectedProject.logo}
                      alt={`${selectedProject.title} logo`}
                      width={56}
                      height={56}
                      className="size-full object-contain"
                    />
                  )}
                </div>

                <span className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-black/45 sm:text-sm">
                  Featured project
                </span>

                <h2 className="max-w-2xl text-4xl font-black leading-[0.95] tracking-tight text-black sm:text-5xl md:text-6xl xl:text-7xl">
                  {selectedProject.title}
                </h2>

                <div className="mt-6 h-[2px] w-16 bg-black/70" />

                <p className="mt-6 max-w-lg text-base leading-relaxed text-black/70 sm:text-lg">
                  {selectedProject.text}
                </p>

                <div className="mt-7">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-black/45">
                    Technologies
                  </span>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedProject.tags.map((tag) => (
                      <span
                        key={tag}
                        className="border border-black/30 px-3 py-2 text-xs font-semibold text-black sm:text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <a
                  href={selectedProject.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-4 border-b-2 border-black pb-2 text-base font-bold text-black transition-opacity hover:opacity-50 sm:mt-10 sm:text-lg"
                >
                  Visit project
                  <span aria-hidden="true">↗</span>
                </a>
              </div>

              <div className="flex w-full items-center justify-center">
                <div className="relative aspect-[4/3] w-full max-w-[560px] overflow-hidden bg-black/10 lg:max-h-[58vh]">
                  <Image
                    src={selectedProject.image}
                    alt={`${selectedProject.title} preview`}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover object-top"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />

                  <div className="absolute inset-0 -z-0 flex items-center justify-center">
                    <span className="text-8xl font-black text-black/15">
                      {String(selectedIndex + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center justify-between border-t border-black/20 pt-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-black/40">
                Portfolio / Projects
              </span>

              <span className="text-xs font-semibold text-black/40">
                {String(selectedIndex + 1).padStart(2, "0")} / 03
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
