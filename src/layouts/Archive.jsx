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
  selectedPeriod,
  selectedCategory,
  onActiveNewsChange,
}) {
  const sectionRef = useRef(null);
  const archiveAnchorId = normalizeAnchor(`${lang === "fr" ? "Événements" : "Events"}`);
  const newsItems = Array.isArray(news) ? news : [];

  const getTimestamp = (dateValue) => {
    if (!dateValue) return Number.NEGATIVE_INFINITY;
    const timestamp = new Date(dateValue).getTime();
    return Number.isNaN(timestamp) ? Number.NEGATIVE_INFINITY : timestamp;
  };

  const matchesSelectedPeriod = (item) => {
    if (!selectedPeriod) return true;
    const endTimestamp = getTimestamp(item?.EndDate);
    const nowTimestamp = Date.now();

    if (selectedPeriod === 'upcoming') {
      return endTimestamp > nowTimestamp;
    }

    if (selectedPeriod === 'past') {
      return endTimestamp <= nowTimestamp;
    }

    return true;
  };

  const matchesSelectedCategory = (item) => {
    if (!selectedCategory) return true;
    return (item?.event_categories ?? []).some(
      (category) => category?.Name === selectedCategory
    );
  };

  const getRelevantDateTimestamp = (item) => {
    const endTimestamp = getTimestamp(item?.EndDate);
    if (endTimestamp !== Number.NEGATIVE_INFINITY) return endTimestamp;
    return getTimestamp(item?.StartDate);
  };

  const filteredNews = newsItems
    .filter(
      (item) =>
        matchesSelectedPeriod(item) &&
        matchesSelectedCategory(item)
    )
    .sort((a, b) => {
      const relevantDiff = getRelevantDateTimestamp(b) - getRelevantDateTimestamp(a);
      if (relevantDiff !== 0) return relevantDiff;
      return getTimestamp(b?.StartDate) - getTimestamp(a?.StartDate);
    });

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
  }, [selectedPeriod, selectedCategory, filteredNews.length]);

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