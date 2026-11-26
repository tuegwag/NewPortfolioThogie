
import { contactLinks } from "./contactLinks";

const descriptions: Record<string, string> = {
  "E-mail": "stuur mij een email",
  LinkedIn: "zie mijn linkedIn profiel",
  GitHub: "zie mijn Github account",
};

export default function ContactSection() {
  return (
    <section
      aria-label="Contact"
      className="mt-10 sm:mt-12 md:mt-16"
    >
      <p className="mb-6 text-xs font-semibold uppercase tracking-[0.25em] text-white/50">
        Contact
      </p>

      <div className="mb-8">
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {contactLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={
              link.href.startsWith("http") ? "_blank" : undefined
            }
            rel={
              link.href.startsWith("http")
                ? "noopener noreferrer"
                : undefined
            }
            className="group flex min-h-32 items-center gap-4 border border-white/15 p-5 transition-colors duration-200 hover:border-white/40 hover:bg-white/5 sm:min-h-40 sm:flex-col sm:items-start sm:justify-between sm:p-6"
          >
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-white/15 sm:size-14">
              <img
                src={link.icon}
                alt=""
                className="size-6 object-contain sm:size-7"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold sm:text-xl">
                {link.label}
              </h3>
              <p className="mt-1 text-sm text-white/50">
                {descriptions[link.label]}
              </p>
            </div>

            <span className="ml-auto text-xl text-white/40 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-white sm:hidden">
              ↗
            </span>
            <span className="hidden text-xl text-white/40 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-white sm:block">
              ↗
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
