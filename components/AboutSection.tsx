"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// One entry per photo. Paragraph i belongs to slide i: when slide i is the
// one in the middle of the carousel, paragraph i is shown in white and the
// others are dimmed. Replace the lorem ipsum (and later the label) with real content.
const SECTIONS = [
  {
    label: "01",
    text: "Hallo, ik ben Thomas Lammerse. ik ben een 17 jarige student software developer op het ROC Midden Nederland van Amersfoort. zelf woon ik in Blaricum Nood-Holand. de reden dat ik voor dit vakgebied heb gekozen is omdat ik al een groot deel van mijn leven geinteresseerd ben geweest in de werking van computers en programma's zowel omdat ik familie leden heb die in hetzelfde vakgebied zitten. dat ik zulke familieleden heb is heel fijn want ik kan hun altijd om hulp vragen als ik ergens niet uit kom. op school zit ik altijd samen met een groep fantastische vrienden die dit vak ook heel serieus nemen en die mij ook altijd helpen als ik erom vraag",
  },
  {
    label: "02",
    text: "sinds dat ik op het mbo zit voel ik mij veel meer mezelf. ik durf mezelf meer te uiten en te laten zien wie ik ben. op de middelbare school ging dat niet zo goed waardoor ik daar niet zo'n leuke tijd heb gehad. ik vind dit vak echt bij me passen en dat merk ik ook aan de mensen waarmee ik werk. je merkt vaak dat we dezelfde soort interesses hebt en je wordt niet snel raar aangekeken door je hobbies",
  },
  {
    label: "03",
    text: "Hobbies heb ik natuurlijk ook, ik zit op scouting Vasanta in Huizen waar ik het al jaren naar mijn zin heb. en nu dat ik al op een redelijke leeftijd ben ben ik ook begonnen met de opkomst verzorgen en organiseren voor de jongeren groepen. ook doe ik aan modelbouw, dit heeft een vriend van mijn moeder mij is een keer opgelegd die dit voor zijn werk doet. ik was altijd al een fan van lego bouwen dus deze hobby paste perfect bij mij.  ik ga ook nog wel is lang die vriend van mij moeder om help te vragen. Ook speel ik elektrisch gitaar, dit was een hobbie wat een vriend van mij is een keer naar mij bracht en ik vond het heel leuk, dus nu helpt hij me ook altijd met het leren en maak ik flinke voruitgang",
  },
  {
    label: "04",
    text: "Ik woon in Blaricum, hier woon ik al 10 jaar, origineel heb ik in Hilversum gewoont maar toen mijn ouders uit elkaar gegaan zijn zijn ze allebij verhuist. ik woon voornamelijk bij mijn moeder. mijn vader woont nou eenmaal te ver weg om alles te kunnen doen hier in Nederland. Mijn vader woont namelijk in Lasne, België waar ik een hele nieuwe stief familie en een halfzusje en halfbroertje erbij heb gekregen. bij mijn moeder thuis heb ik ook een nieuwe stieffamilie met daarbij een stief broer en zus die net uit huis zijn gegaan",
  },
  {
    label: "05",
    text: "Vaak heb ik het wel druk, ik werk bij de albert hijen in blaricum, ik doe vrijwilligers werk, ik heb school en soms werk ik nog wat extra bij het bedrijf waar mijn zus werkt. toch probeer ik altijd wel tijd te besteden aan het leren van het programeren en aan mijn hobbies, want ik wil mij natuurlijk niet in de stress werken",
  },
  {
    label: "06",
    text: "Ik ben zelf best wel een Nerd, ik doe veel dingen die veel mensen beschouwen als nerderig gedrag. ik doe aan modelbouw, ik doe aan software development en ik ga naar evenementen zoals comic con. toch laat ik mij daar niet aan stoppen, ik uit het altijd graag wat mijn hobbies zijn want ik vind het niet fijn om mijzelf te verbergen om een of andere norm aan te houden. niet alleen dat maar het maakt me ook een stuk gellukiger om mijzelf te kunnen uiten zoals ik ben. ik heb veel vrienden die hetzelfde hebben en met hun ga ik ook veel om. ik vind zelf dat iedereen zich mag uiten zoals die zich voelt (met een paar duidelijke uitzonderingen dan).",
  },
  {
    label: "07",
    text: "dit ben ik dus, als je dit helemaal hebt gelezen dan echt proficiat want ik had eigenlijk niet verwacht dat iemand dat zou doen.",
  },
];

// Photos live in the public folder: public/img/section1.jpg ... section6.jpg
// (Next.js serves everything in public/ from the site root, so that is /img/section1.jpg).
// Change IMAGE_EXTENSION if your files are .png, .webp, etc.
const IMAGE_EXTENSION = "jpg";
const IMAGE_COUNT = 7;
const imageFor = (index: number): string | undefined =>
  index < IMAGE_COUNT ? `/img/section${index + 1}.${IMAGE_EXTENSION}` : undefined;

// When a paragraph is "on", it starts this many px below the top of the box, so a
// little of the previous paragraph stays visible above it (the top fade sits there).
const TOP_OFFSET = 32;

// The scroll position at which a paragraph is "on": it starts near the top of the
// box. A paragraph that fits in the box is never cut off at the bottom, so it may
// start a little higher than TOP_OFFSET if it needs to.
function startStop(el: HTMLDivElement, child: Element, max: number): number {
  const base = el.getBoundingClientRect().top;
  const top = child.getBoundingClientRect().top - base + el.scrollTop;
  const bottom = top + (child as HTMLElement).offsetHeight;
  let y = top - TOP_OFFSET;
  if (bottom - top <= el.clientHeight) y = Math.max(y, bottom - el.clientHeight);
  return Math.min(max, Math.max(0, y));
}

// Where each paragraph "is" in the scrolling text, as a scrollTop value.
function getAnchors(el: HTMLDivElement, max: number): number[] {
  return Array.from(el.children).map((child) => startStop(el, child, max));
}

// The places the mouse wheel stops, in order. Every paragraph has one stop where it
// starts near the top of the box. A paragraph that is taller than the box also gets
// extra stops, the last one showing its final line, so nothing is ever skipped.
function getStops(el: HTMLDivElement, max: number): number[] {
  const base = el.getBoundingClientRect().top;
  const view = el.clientHeight;
  const clamp = (y: number) => Math.min(max, Math.max(0, y));
  const stops: number[] = [];
  Array.from(el.children).forEach((child) => {
    const top = child.getBoundingClientRect().top - base + el.scrollTop;
    const bottom = top + (child as HTMLElement).offsetHeight;
    let y = startStop(el, child, max);
    stops.push(y);
    while (y + view < bottom) {
      y = Math.min(y + view * 0.8, bottom - view);
      stops.push(clamp(y));
    }
  });
  return stops;
}

export default function AboutSection() {
  // The wrapper owns two CSS variables, written straight to the DOM so React
  // doesn't re-render on every scroll event:
  //   --p  scroll progress of the text (0 = top, 1 = bottom), used by the scrollbar dot
  //   --c  carousel position (0..1), used by the photos
  const wrapperRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Whether there is more text above / below the visible part.
  // The top and bottom shadows only show when this is true.
  const [moreAbove, setMoreAbove] = useState(false);
  const [moreBelow, setMoreBelow] = useState(false);

  // Whether the text is long enough to scroll at all (hides the custom scrollbar if not).
  const [scrollable, setScrollable] = useState(false);

  // Which slide (and so which paragraph) is currently "on".
  const [active, setActive] = useState(0);

  // Slides whose image failed to load (wrong name or extension) fall back to the number.
  const [failed, setFailed] = useState<Record<number, boolean>>({});

  // Empty space added below the last paragraph so even the last (short) paragraphs
  // can scroll all the way up to the top of the box.
  const [tail, setTail] = useState(0);

  const update = (el: HTMLDivElement) => {
    const max = el.scrollHeight - el.clientHeight;
    const progress = max > 0 ? el.scrollTop / max : 0;
    wrapperRef.current?.style.setProperty("--p", progress.toFixed(4));
    setMoreAbove(el.scrollTop > 1);
    setMoreBelow(el.scrollTop < max - 1);
    setScrollable(max > 1);

    // Carousel position. Paragraphs have different lengths, so instead of using
    // the overall scroll percentage, each paragraph has an "anchor" in the text
    // and a matching carousel position. We blend between the two anchors around
    // the current scroll position. This keeps the photo and the white paragraph
    // matched, whatever the text lengths are.
    const track = trackRef.current;
    const frame = track?.parentElement;
    if (!track || !frame) return;
    const anchors = getAnchors(el, max);
    const range = track.offsetHeight - frame.offsetHeight;
    // Carousel progress (0..1) at which each slide is closest to the middle.
    const carousel = anchors.map((_, i) => {
      const slide = slideRefs.current[i];
      if (!slide || range <= 0) return 0;
      const centre = slide.offsetTop + slide.offsetHeight / 2;
      return Math.min(1, Math.max(0, (centre - frame.offsetHeight / 2) / range));
    });

    const last = anchors.length - 1;
    let i = last;
    for (let k = 0; k < last; k++) {
      if (el.scrollTop < anchors[k + 1]) {
        i = k;
        break;
      }
    }
    let fraction = 0;
    if (i < last) {
      const span = anchors[i + 1] - anchors[i];
      fraction = span > 0 ? (el.scrollTop - anchors[i]) / span : 0;
    }
    const c =
      i < last
        ? carousel[i] + fraction * (carousel[i + 1] - carousel[i])
        : carousel[last];
    wrapperRef.current?.style.setProperty("--c", c.toFixed(4));

    // The paragraph that is "on" is the nearest one, but never one that is
    // (almost) outside the box: then the previous / next one is used instead.
    let candidate = Math.round(i + fraction);
    const box = el.getBoundingClientRect();
    const rect = el.children[candidate]?.getBoundingClientRect();
    if (rect && candidate > 0 && rect.top > box.bottom - 40) candidate -= 1;
    else if (rect && candidate < last && rect.bottom < box.top + 40) candidate += 1;
    setActive(candidate);
  };

  // Custom scrollbar: click or drag on the line to scroll the text.
  const DOT = 12; // px, must match the dot size in the JSX below
  const seek = (e: React.PointerEvent<HTMLDivElement>) => {
    const text = textRef.current;
    if (!text) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientY - rect.top - DOT / 2) / (rect.height - DOT);
    const clamped = Math.min(1, Math.max(0, ratio));
    text.scrollTop = clamped * (text.scrollHeight - text.clientHeight);
  };

  // Set the initial state and keep it right when the screen is resized.
  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const sync = () => {
      const lastParagraph = el.lastElementChild as HTMLElement | null;
      if (lastParagraph) {
        setTail(Math.max(0, el.clientHeight - lastParagraph.offsetHeight - TOP_OFFSET));
      }
      update(el);
    };
    sync();
    window.addEventListener("resize", sync);
    // Text height changes once the web font has loaded.
    document.fonts?.ready.then(sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  // Once the extra space is applied the scroll range has changed, so recalculate.
  useEffect(() => {
    if (textRef.current) update(textRef.current);
  }, [tail]);

  // Mouse wheel: one notch moves to the next step (the next paragraph) instead of
  // a fixed ~100px. A paragraph taller than the box gets extra steps so you can
  // still read all of it. Touch, keyboard and the custom scrollbar are unchanged.
  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    let locked = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      const dir = e.deltaY > 0 ? 1 : -1;
      const max = el.scrollHeight - el.clientHeight;

      // At the very top or bottom, let the page scroll as normal.
      if (
        (dir === 1 && el.scrollTop >= max - 1) ||
        (dir === -1 && el.scrollTop <= 1)
      ) {
        return;
      }
      e.preventDefault();
      if (locked) return;

      const sorted = getStops(el, max);

      const target =
        dir === 1
          ? (sorted.find((s) => s > el.scrollTop + 2) ?? max)
          : ([...sorted].reverse().find((s) => s < el.scrollTop - 2) ?? 0);

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollTo({ top: target, behavior: reduce ? "auto" : "smooth" });

      locked = true;
      timer = setTimeout(() => {
        locked = false;
      }, 400);
    };

    // passive: false is needed so preventDefault can stop the normal wheel scroll.
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      clearTimeout(timer);
    };
  }, []);

  return (
    <section
      aria-labelledby="about-title"
      className="mt-10 sm:mt-12 md:mt-16"
    >
      <h2
        id="about-title"
        className="text-2xl font-bold sm:text-3xl md:text-4xl"
      >
        Over mij
      </h2>

      {/* --view is the height of both blocks; it grows with the screen. */}
      <div
        ref={wrapperRef}
        className="mt-6 grid grid-cols-1 gap-6 [--p:0] [--c:0] [--view:20rem] sm:[--view:24rem] md:grid-cols-2 md:gap-10 md:[--view:28rem] lg:gap-16 lg:[--view:32rem]"
      >
        {/* Left: scrollable text with fading shadows at the top and bottom */}
        <div className="relative">
          <div
            ref={textRef}
            role="region"
            aria-label="Over mij, scrolbare tekst"
            tabIndex={0}
            onScroll={(e) => update(e.currentTarget)}
            style={{ paddingBottom: tail }}
            className="h-(--view) space-y-4 overflow-y-auto pr-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden text-base leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:text-lg"
          >
            {SECTIONS.map((section, i) => (
              <p
                key={section.label}
                className={`transition-colors duration-300 ${
                  i === active ? "text-white" : "text-white/50"
                }`}
              >
                {section.text}
              </p>
            ))}
          </div>

          {/* Custom scrollbar: a thin line with a dot, like the divider.
              The dot position comes from --p, set in update(). */}
          <div
            aria-hidden="true"
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              seek(e);
            }}
            onPointerMove={(e) => {
              if (e.currentTarget.hasPointerCapture(e.pointerId)) seek(e);
            }}
            className={`group absolute inset-y-0 right-0 z-10 flex w-6 cursor-pointer touch-none justify-center transition-opacity duration-200 ${
              scrollable ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <div className="h-full w-0.5 rounded-full bg-white/20" />
            <div
              className="absolute left-1/2 size-3 -translate-x-1/2 rounded-full bg-white transition-transform duration-150 group-hover:scale-125 group-active:scale-125"
              style={{ top: "calc(var(--p) * (100% - 12px))" }}
            />
          </div>

          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-x-0 top-0 h-8 bg-linear-to-b from-background to-transparent transition-opacity duration-200 ${
              moreAbove ? "opacity-100" : "opacity-0"
            }`}
          />
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-linear-to-t from-background to-transparent transition-opacity duration-200 sm:h-16 ${
              moreBelow ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        {/* Right: carousel, tilted 5deg, driven by --c */}
        <div
          aria-hidden="true"
          className="relative h-(--view) overflow-hidden rounded-2xl"
        >
          {/* Oversized and rotated so the corners never show empty space. */}
          <div
            className="absolute -left-[20%] w-[140%] origin-center"
            style={{
              top: "calc(var(--view) * -0.2)",
              height: "calc(var(--view) * 1.4)",
              transform: "rotate(5deg)",
            }}
          >
            {/* The track slides along the tilted axis as --p goes 0 -> 1. */}
            <div
              ref={trackRef}
              className="flex flex-col items-center gap-4 will-change-transform"
              style={{
                transform:
                  "translateY(calc(var(--c) * (-100% + var(--view) * 1.4)))",
              }}
            >
              {SECTIONS.map((section, i) => (
                <div
                  key={section.label}
                  ref={(node) => {
                    slideRefs.current[i] = node;
                  }}
                  className="relative flex w-3/5 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white/10 text-5xl font-bold text-white/70 sm:text-6xl"
                  style={{ height: "calc(var(--view) * 0.7)" }}
                >
                  {imageFor(i) && !failed[i] ? (
                    <Image
                      src={imageFor(i)!}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 30vw, 60vw"
                      className="object-cover"
                      onError={() => setFailed((prev) => ({ ...prev, [i]: true }))}
                    />
                  ) : (
                    // No image for this slide (or it failed to load): show the number.
                    section.label
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Same top/bottom fade as the text, so photos don't just cut off.
              They show under the same conditions: only when there is more to see. */}
          <div
            className={`pointer-events-none absolute inset-x-0 top-0 h-16 bg-linear-to-b from-background to-transparent transition-opacity duration-200 sm:h-20 ${
              moreAbove ? "opacity-100" : "opacity-0"
            }`}
          />
          <div
            className={`pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-background to-transparent transition-opacity duration-200 sm:h-20 ${
              moreBelow ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      </div>
    </section>
  );
}