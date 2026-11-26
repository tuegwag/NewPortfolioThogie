
"use client";

import { useState } from "react";

interface Skill {
  name: string;
  // Optional icon name from https://simpleicons.org
  icon?: string;
}

interface SkillGroup {
  title: string;
  skills: Skill[];
}

// Add or remove skills in these lists.
const SKILL_GROUPS: SkillGroup[] = [
  {
    title: "Talen",
    skills: [
      { name: "HTML", icon: "html5" },
      { name: "CSS", icon: "css" },
      { name: "JavaScript", icon: "javascript" },
      { name: "TypeScript", icon: "typescript" },
      { name: "PHP", icon: "php" },
      { name: "C#"},
      { name: "SQL" },
    ],
  },
  {
    title: "Libraries & Frameworks",
    skills: [
      { name: "React", icon: "react" },
      { name: "Next.js", icon: "nextdotjs" },
      { name: "Yii2", icon: "yii" },
      { name: "Bootstrap", icon: "bootstrap" },
      { name: "Tailwind CSS", icon: "tailwindcss" },
      { name: "SCSS", icon: "sass"},
      { name: "HeroUI", icon: "heroui" },
      { name: "MotionUI"},
    ],
  },
  {
    title: "Game Development & Design",
    skills: [
      { name: "Unity", icon: "unity" },
      { name: "Figma", icon: "figma" },
      { name: "Aseprite", icon: "aseprite" },
      { name: "Blender", icon: "blender" },
    ],
  },
  {
    title: "Database & Tools",
    skills: [
      { name: "MySQL", icon: "mysql" },
      { name: "Docker", icon: "docker" },
      { name: "Git", icon: "git" },
      { name: "Linux", icon: "linux" },
    ],
  },
];

function SkillIcon({ name }: { name: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    <img
      src={`https://cdn.simpleicons.org/${name}/white`}
      alt=""
      loading="lazy"
      className="size-4 sm:size-5"
      onError={() => setFailed(true)}
    />
  );
}

export default function SkillsSection() {
  return (
    
   <section aria-label="Skills" className="mt-10 sm:mt-12 md:mt-16">
  <p className="mb-6 text-xs font-semibold uppercase tracking-[0.25em] text-white/50">
    Skills
  </p>

  <div className="grid grid-cols-1 gap-10 sm:gap-12 md:grid-cols-2 md:gap-x-16 md:gap-y-14">
        {SKILL_GROUPS.map((group) => (
          <div key={group.title}>
            <h3 className="text-xl font-bold sm:text-2xl md:text-3xl">
              {group.title}
            </h3>

            <ul className="mt-5 flex flex-wrap gap-2 sm:gap-3">
              {group.skills.map((skill) => (
                <li
                  key={skill.name}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base"
                >
                  {skill.icon && <SkillIcon name={skill.icon} />}
                  {skill.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
