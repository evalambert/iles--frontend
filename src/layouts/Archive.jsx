//src/layouts/Archive.jsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { normalizeAnchor } from '../assets/scripts/utils/normalizeAnchor';
import NewsSection from '../components/features/news/NewsSection';

gsap.registerPlugin(ScrollTrigger);

export default function Archive({
  news,
  lang,
  selectedYear,
  selectedCategory,
  onActiveNewsChange,
}) {
  const sectionRef = useRef(null);
  const archiveAnchorId = normalizeAnchor(`${lang === "fr" ? "Archive" : "Archive"}`);
  const newsItems = Array.isArray(news) ? news : [];

  const matchesSelectedYear = (item) => {
    if (!selectedYear) return true;
    return item?.StartDate?.startsWith(selectedYear);
  };

  const matchesSelectedCategory = (item) => {
    if (!selectedCategory) return true;
    return (item?.event_categories ?? []).some(
      (category) => category?.Name === selectedCategory
    );
  };

  const filteredNews = newsItems.filter(
    (item) => matchesSelectedYear(item) && matchesSelectedCategory(item)
  );

  useEffect(() => {
    if (!sectionRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top center',
      end: 'bottom center',
      onLeave: () => onActiveNewsChange?.(''),
      onLeaveBack: () => onActiveNewsChange?.(''),
    });

    return () => {
      trigger.kill();
    };
  }, [onActiveNewsChange]);

  useEffect(() => {
    let rafId1;
    let rafId2;

    rafId1 = requestAnimationFrame(() => {
      rafId2 = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    });

    return () => {
      if (rafId1) cancelAnimationFrame(rafId1);
      if (rafId2) cancelAnimationFrame(rafId2);
    };
  }, [selectedYear, selectedCategory, filteredNews.length]);

  return (
    <div
    ref={sectionRef}
    id={archiveAnchorId}
    className=" mt-header-height scroll-mt-[calc(var(--spacing-header-height)+10px)] p-[10px] bg-linear-to-t from-primary to-light to-40%">
      <ul>
        {filteredNews.map((item) => (
          <NewsSection
            key={item.id}
            news={item}
            lang={lang}
            paragraphs={item?.Paragraphs ?? []}
            images={item?.Images ?? []}
            onActiveNewsChange={onActiveNewsChange}
          />
        ))}
      </ul>
    </div>
  )
}