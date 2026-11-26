"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { contactLinks } from "./contactLinks";

const round = "rounded-full text-white border-0 outline-none";

const BASE_DELAY = 750;
const STAGGER = 50;

function Tip({ label, children }: { label: string; children: ReactNode }) {
  const [hidden, setHidden] = useState(false);

  return (
    <div
      className="group relative"
      onClickCapture={() => setHidden(true)}
      onMouseLeave={() => setHidden(false)}
    >
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-white px-2 py-1 text-xs font-medium text-black shadow-lg transition-opacity duration-150 ${
          hidden
            ? "opacity-0"
            : "opacity-0 group-hover:opacity-100 group-has-[:focus-visible]:opacity-100"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

export default function ContactMenu() {
  const router = useRouter();

  const go = (href: string) => {
    if (href.startsWith("/")) router.push(href);
    else if (href.startsWith("http"))
      window.open(href, "_blank", "noopener,noreferrer");
    else window.location.href = href; // mailto: and tel:
  };

  return (
    <div className="mt-8 flex flex-wrap items-center gap-2">
      {contactLinks.map((link, i) => (
        <div
          key={link.label}
          className="wave-in"
          style={{ animationDelay: `${BASE_DELAY + i * STAGGER}ms` }}
        >
          <Tip label={link.label}>
            <Button
              variant="outline"
              isIconOnly
              className={round}
              aria-label={link.label}
              onPress={() => go(link.href)}
            >
              <img width="25" height="25" src={link.icon} alt="" />
            </Button>
          </Tip>
        </div>
      ))}
    </div>
  );
}
