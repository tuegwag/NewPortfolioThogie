import HoverText from "../components/HoverText";
import ContactMenu from "../components/ContactMenu";
import Divider from "../components/Divider";
import AboutSection from "../components/AboutSection";
import PathSection from "../components/PathSection";
import PageScrollbar from "@/components/PageScrollBar";

export default function Home() {
  return (
    <main className="flex flex-col px-4 pt-8 pb-8 sm:px-8 sm:pt-12 md:px-16 md:pt-16 lg:px-24 lg:pt-20">
      <PageScrollbar />

      <p className="text-base sm:text-lg md:text-xl">portfolio van</p>

      <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
        <HoverText text="Thomas Lammerse" />
      </h1>

      <p
        id="descriptionSelf"
        className="mt-6 max-w-xl text-base sm:text-xl md:text-2xl"
      >
        Student software development op het ROC Midden Nederland van Amersfoort
      </p>
      <ContactMenu />

      <Divider />
      <AboutSection />

      <Divider />
      <PathSection />

      <Divider />
    </main>
  );
}