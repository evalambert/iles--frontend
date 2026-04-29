//src/layouts/About.jsx

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AboutSection from '../components/features/about/AboutSection';
import { normalizeAnchor } from '../assets/scripts/utils/normalizeAnchor';

gsap.registerPlugin(ScrollTrigger);

export default function About({ data, lang, onActiveAboutChange }) {
    const sectionRef = useRef(null);
    const sections = data?.Sections ?? [];

    useEffect(() => {
        if (!sectionRef.current) return;

        const trigger = ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top 100px',
            end: 'bottom 100px',
            onLeave: () => onActiveAboutChange?.(''),
            onLeaveBack: () => onActiveAboutChange?.(''),
        });

        return () => {
            trigger.kill();
        };
    }, [onActiveAboutChange]);

    return (
        <div
            ref={sectionRef}
            id={normalizeAnchor(`${lang === 'fr' ? 'À propos' : 'About'}`)}
            className=' mt-header-height scroll-mt-[calc(var(--spacing-header-height)+10px)] p-[10px] bg-linear-to-t from-primary to-light to-40%'
        >



            {sections.map((section) => {
                // `section.Chapo` provient de Strapi en Rich Text (tableau de noeuds { type, children }).
                // On le transmet tel quel au composant pour qu'il puisse rendre texte + liens.
                const chapo = section?.Chapo ?? null;

                return (
                    <AboutSection
                        key={section.id}
                        title={section.Title}
                        chapo={chapo}
                        paragraphs={section?.Paragraphs ?? []}
                        images={section?.Images ?? []}
                        onActiveAboutChange={onActiveAboutChange}
                    />
                );
            })}
        </div>
    );
}

