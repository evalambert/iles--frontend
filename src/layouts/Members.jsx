//src/layouts/Members.jsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MemberSection from '../components/features/members/MemberSection';
import { normalizeAnchor } from '../assets/scripts/utils/normalizeAnchor';

gsap.registerPlugin(ScrollTrigger);

export default function Members({ data, lang, selectedPractice, onActiveMemberChange }) {
    const sectionRef = useRef(null);
    const membersAnchorId = normalizeAnchor(`${lang === "fr" ? "Membres" : "Members"}`);
    const members = Array.isArray(data) ? data : (data?.data ?? []);
    const filteredMembers = members.filter((member) => {
        if (!selectedPractice) return true;
        return (member?.practices ?? []).some((practice) => practice?.Name === selectedPractice);
    });

    const getSortKey = (value) => {
        if (typeof value === 'string') return value.trim();
        if (value == null) return '';
        return String(value).trim();
    };

    // Tri alphabétique sur `firstName` puis fallback sur `lastName` si `firstName` est vide.
    // `index` sert à garder un tri stable quand les clés sont identiques.
    const sortedMembers = filteredMembers
        .map((member, index) => {
            const first = getSortKey(member?.FirstName);
            const last = getSortKey(member?.LastName);
            const key = first || last;
            return { member, index, key };
        })
        .sort((a, b) => {
            const cmp = a.key.localeCompare(b.key, lang ?? 'fr', { sensitivity: 'base' });
            return cmp !== 0 ? cmp : a.index - b.index;
        })
        .map(({ member }) => member);

    useEffect(() => {
        if (!sectionRef.current) return;

        const trigger = ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top center',
            end: 'bottom center',
            onLeave: () => onActiveMemberChange?.(''),
            onLeaveBack: () => onActiveMemberChange?.(''),
        });

        return () => {
            trigger.kill();
        };
    }, [onActiveMemberChange]);

    useEffect(() => {
        // Recalcule les positions ScrollTrigger seulement après le rendu
        // du filtrage (hauteur du document potentiellement modifiée).
        let rafId1;
        let rafId2;

        rafId1 = requestAnimationFrame(() => {
            rafId2 = requestAnimationFrame(() => {
                ScrollTrigger.refresh();

                const shouldScrollToMembers =
                    window.matchMedia('(min-width: 1024px)').matches &&
                    window.location.hash === `#${membersAnchorId}`;

                if (shouldScrollToMembers) {
                    sectionRef.current?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                    });
                }
            });
        });

        return () => {
            if (rafId1) cancelAnimationFrame(rafId1);
            if (rafId2) cancelAnimationFrame(rafId2);
        };
    }, [selectedPractice, filteredMembers.length, membersAnchorId]);
    
    return (

        <div
            ref={sectionRef}
            id={membersAnchorId}
            className='mt-header-height scroll-mt-header-height p-[10px] bg-linear-to-t from-primary to-light to-40%  min-h-[calc(100vh-var(--spacing-header-height))]'
        >

            {sortedMembers.map((member, index) => {
                if (index === sortedMembers.length - 1) {
                    return (
                        <div key={member.id} className='min-h-[calc((100vh-var(--spacing-header-height))-20px)] mt-[10px]'>
                            <MemberSection
                                firstName={member?.FirstName}
                                lastName={member?.LastName}
                                bio={member?.Bio}
                                website={member?.Website}
                                email={member?.Email}
                                instagram={member?.Instagram ?? []}
                                instagramUrl={member?.InstagramUrl}
                                instagramName={member?.InstagramName}
                                practices={member?.practices ?? []}
                                images={member?.Images ?? []}
                                lang={lang}
                                onActiveMemberChange={onActiveMemberChange}
                            />
                        </div>
                    );
                }

                return (
                    <MemberSection
                        key={member.id}
                        firstName={member?.FirstName}
                        lastName={member?.LastName}
                        bio={member?.Bio}
                        website={member?.Website}
                        email={member?.Email}
                        instagram={member?.Instagram ?? []}
                        instagramUrl={member?.InstagramUrl}
                        instagramName={member?.InstagramName}
                        practices={member?.practices ?? []}
                        images={member?.Images ?? []}
                        lang={lang}
                        onActiveMemberChange={onActiveMemberChange}
                    />
                );
            })}
        </div>
    );
}
