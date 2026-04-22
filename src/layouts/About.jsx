//src/layouts/About.jsx

import AboutSection from '../components/features/about/AboutSection';
import { normalizeAnchor } from '../assets/scripts/utils/normalizeAnchor';

export default function About({ data, lang }) {
  const sections = data?.Sections ?? [];

  return (
    <div id={normalizeAnchor(`${lang === "fr" ? "À propos" : "About"}`)} className=" mt-header-height scroll-mt-[calc(var(--spacing-header-height)+10px)] p-[10px] bg-linear-to-t from-primary to-light to-40%">



      {sections.map((section) => {
        const firstParagraph = section?.Chapo?.[0];
        const chapo = firstParagraph?.children?.map((child) => child.text).join(' ') ?? null;

        return (
          <AboutSection
            key={section.id}
            title={section.Title}
            chapo={chapo}
            paragraphs={section?.Paragraphs ?? []}
            images={section?.Images ?? []}
          />
        );
      })}
    </div>
  );
}