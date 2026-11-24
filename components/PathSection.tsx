"use client";

import { useEffect, useRef, useState } from "react";

interface Tag {
  name: string;
  // Icon name on simpleicons.org (https://simpleicons.org). Leave out for a text-only tag.
  icon?: string;
}

interface Entry {
  meta: string;
  title: string;
  text: string;
  tags: Tag[];
  links?: { label: string; href: string }[];
}

// Everything on the page is in this list. Add, remove or edit entries here.
const ENTRIES: Entry[] = [
  {
    meta: "Opleiding · 2025 – 2028 (huidig)",
    title: "Software Development aan ROC Midden Nederland",
    text: "MBO Software Development in Nederland.",
    tags: [
      { name: "HTML", icon: "html5" },
      { name: "CSS", icon: "css" },
      { name: "JavaScript", icon: "javascript" },
      { name: "C#", icon: "csharp" },
      { name: "Unity", icon: "unity" },
      { name: "PHP", icon: "php" },
      { name: "SQL" },
      { name: "MySQL", icon: "mysql" },
      { name: "Docker", icon: "docker" },
      { name: "Git", icon: "git" },
      { name: "Scss", icon: "sass" },
    ],
  },
  {
    meta: "Ervaring · 2026 – 2027 (huidig)",
    title: "Stage bij Websight",
    text: "Ik leer hier hoe ik in een team samen moet werken, hoe het op het echte werkveld allemaal werkt en hoe het veschilt met de opdrachten van school en het gebruik maken van frameworks and libraries die ik nog nooit eerder heb gebruikt",
    tags: [
      { name: "Yii2", icon: "yii" },
      { name: "React", icon: "react" },
      { name: "typescript", icon: "typescript" },
       { name: "Next.js", icon: "nextdotjs" },
         { name: "Docker", icon: "docker" },
         { name: "Bootstrap", icon: "bootstrap" },
          { name: "Tailwind", icon: "tailwindcss" },
          { name: "Linux", icon: "linux" },
      { name: "Git", icon: "git" },
    ],

    links: [
      { label: "Websight", href: "https://websight.nl/" },
      { label: "Bedrijf in Hilversum", href: "https://www.google.com/maps/place/Hilversum/@52.2315428,5.0781477,12z/data=!3m1!4b1!4m6!3m5!1s0x47c643ebada6a5f7:0x1c1f3931512f9233!8m2!3d52.2291696!4d5.1668974!16zL20vMDNrZmw?entry=ttu&g_ep=EgoyMDI2MTExOC4xIKXMDSoASAFQAw%3D%3D" },
    ],
  },
];

const DOT = 12; 


function TagIcon({ name }: { name: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (

    <img
      ref={(img) => {
  
        if (img?.complete && img.naturalWidth === 0) setFailed(true);
      }}
      src={`https://cdn.simpleicons.org/${name}/white`}
      alt=""
      loading="lazy"
      className="size-4 sm:size-5"
      onError={() => setFailed(true)}
    />
  );
}

export default function PathSection() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  // The line fills with white as you scroll down the section, and each dot lights
  // up once the line reaches it. Written straight to the DOM (no React re-render).
  useEffect(() => {
    const timeline = timelineRef.current;
    const fill = fillRef.current;
    if (!timeline || !fill) return;

    const update = () => {
      const rect = timeline.getBoundingClientRect();
      const reach = window.innerHeight * 0.6 - rect.top; // how far down the line "we" are
      const inset = DOT / 2; // the line starts and ends at the centre of the first/last dot
      const length = Math.max(0, rect.height - inset * 2);
      fill.style.height = `${Math.min(length, Math.max(0, reach - inset))}px`;

      timeline.querySelectorAll<HTMLElement>("[data-dot]").forEach((dot) => {
        const centre = dot.getBoundingClientRect().top - rect.top + DOT / 2;
        dot.dataset.active = String(reach >= centre);
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section aria-label="Pad" className="mt-10 sm:mt-12 md:mt-16">
      <div>
        <div ref={timelineRef} className="relative pl-8 sm:pl-10">
          {/* The line, and the white part of it that fills as you scroll. */}
          <div
            aria-hidden="true"
            className="absolute top-1.5 bottom-1.5 left-[5px] w-0.5 rounded-full bg-white/20"
          />
          <div
            ref={fillRef}
            aria-hidden="true"
            className="absolute top-1.5 left-[5px] w-0.5 rounded-full bg-white"
            style={{ height: 0 }}
          />

          <ol className="space-y-12 sm:space-y-16">
            {ENTRIES.map((entry) => (
              <li key={entry.title} className="relative">
                <span
                  data-dot
                  data-active="false"
                  aria-hidden="true"
                  className="absolute top-1 -left-8 size-3 rounded-full bg-white/30 transition-colors duration-300 data-[active=true]:bg-white sm:-left-10"
                />

                <p className="text-sm text-white/50 sm:text-base">
                  {entry.meta}
                </p>
                <h3 className="mt-1 text-xl font-bold sm:text-2xl md:text-3xl">
                  {entry.title}
                </h3>
                <p className="mt-3 max-w-2xl text-base text-white/70 sm:text-lg">
                  {entry.text}
                </p>

                <ul className="mt-5 flex flex-wrap gap-2 sm:gap-3">
                  {entry.tags.map((tag) => (
                    <li
                      key={tag.name}
                      className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base"
                    >
                      {tag.icon && <TagIcon name={tag.icon} />}
                      {tag.name}
                    </li>
                  ))}
                </ul>

                {entry.links && (
                  <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
                    {entry.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base underline decoration-white/40 decoration-2 underline-offset-4 transition-colors hover:decoration-white sm:text-lg"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}