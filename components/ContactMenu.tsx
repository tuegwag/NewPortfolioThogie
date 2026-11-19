"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { ChevronsRight } from "lucide-react";

const round = "rounded-full";

export default function ContactMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const go = (href: string) => {
    if (href.startsWith("/")) router.push(href);
    else if (href.startsWith("http")) window.open(href, "_blank", "noopener,noreferrer");
    else window.location.href = href; // mailto: and tel:
  };

  return (
    <div className="mt-8 flex flex-wrap items-center gap-2">
      <Button
        variant="outline"
        isIconOnly
         className={`${round} text-white`}
        aria-label={open ? "Sluit contactmenu" : "Open contactmenu"}
        aria-expanded={open}
        onPress={() => setOpen((o) => !o)}
      >
        <ChevronsRight
          className={`size-5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </Button>

      {open && (
        <>
          <Button
            variant="outline"
            isIconOnly
            className={`${round} text-white`}
            aria-label="E-mail"
            onPress={() => go("mailto:jouw@email.nl")}
          >
            1
          </Button>

          <Button
            variant="outline"
            isIconOnly
             className={`${round} text-white`}
            aria-label="Bel mij"
            onPress={() => go("tel:+31612345678")}
          >
            2
          </Button>

          <Button
            variant="outline"
            isIconOnly
             className={`${round} text-white`}
            aria-label="Chat via WhatsApp"
            onPress={() => go("https://wa.me/31612345678")}
          >
            3
          </Button>
        </>
      )}
    </div>
  );
}