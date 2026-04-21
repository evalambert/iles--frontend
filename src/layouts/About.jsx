//src/layouts/About.jsx

import AboutSection from '../components/features/about/AboutSection';

export default function About({ data }) {
  const sections = data?.Sections ?? [];

  return (
    <div className="border-1 border-blue-00 text-blue-300 p-4">

      <h2 className="text-2xl font-bold mb-4">SECTION ABOUT</h2>


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