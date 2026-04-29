//src/components/features/news/NewsSection.jsx

import Slider from '../slider/Slider';
import ImageSlider from '../../common/ImageSlider';
import Lightbox from '../lightbox/Lightbox';
import NewsRdvSection from './NewsRdvSection';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { normalizeAnchor } from '../../../assets/scripts/utils/normalizeAnchor';

gsap.registerPlugin(ScrollTrigger);

export default function NewsSection({
    news,
    lang,
    paragraphs,
    images,
    onActiveNewsChange,
}) {
    const [lightboxIndex, setLightboxIndex] = useState(null);
    const hasImages = Array.isArray(images) && images.length > 0;
    const newsAnchor = normalizeAnchor(news.Title);
    const sectionRef = useRef(null);

    // *** DATE FORMATTING ***
    const parseIsoDate = (value) => {
        if (typeof value !== 'string') return null;
        const parts = value.split('-');
        if (parts.length !== 3) return null;

        const year = Number(parts[0]);
        const month = Number(parts[1]);
        const day = Number(parts[2]);

        if (
            !Number.isInteger(year) ||
            !Number.isInteger(month) ||
            !Number.isInteger(day)
        ) {
            return null;
        }

        if (month < 1 || month > 12 || day < 1 || day > 31) {
            return null;
        }

        return { day, month, year };
    };

    const pad2 = (value) => String(value).padStart(2, '0');

    const formatDate = (dateParts) => {
        if (!dateParts) return '';
        return `${pad2(dateParts.day)}/${pad2(dateParts.month)}/${dateParts.year}`;
    };
    const formatDateWithoutYear = (dateParts) => {
        if (!dateParts) return '';
        return `${pad2(dateParts.day)}/${pad2(dateParts.month)}`;
    };

    const formatDateRange = (startDateValue, endDateValue) => {
        const startDate = parseIsoDate(startDateValue);
        const endDate = parseIsoDate(endDateValue);

        if (startDate && endDate) {
            const sameMonthAndYear =
                startDate.month === endDate.month &&
                startDate.year === endDate.year;

            if (sameMonthAndYear) {
                return `${pad2(startDate.day)}-${pad2(endDate.day)}/${pad2(startDate.month)}/${startDate.year}`;
            }

            const sameYear = startDate.year === endDate.year;
            const startFormatted = sameYear
                ? formatDateWithoutYear(startDate)
                : formatDate(startDate);
            const endFormatted = formatDate(endDate);

            if (lang === 'en') {
                return `from ${startFormatted} to ${endFormatted}`;
            }

            return `du ${startFormatted} au ${endFormatted}`;
        }

        if (startDate) return formatDate(startDate);
        if (endDate) return formatDate(endDate);
        return '';
    };

    const formatHour = (value) => {
        if (typeof value !== 'string') return '';
        const parts = value.split(':');
        if (parts.length < 2) return '';

        const hour = parts[0];
        const minutes = parts[1];

        if (!/^\d{2}$/.test(hour) || !/^\d{2}$/.test(minutes)) return '';
        return `${hour}:${minutes}`;
    };

    const formatHourRange = (startHourValue, endHourValue) => {
        const startHour = formatHour(startHourValue);
        const endHour = formatHour(endHourValue);

        if (startHour && endHour) {
            return lang === 'en'
                ? `from ${startHour} to ${endHour}`
                : `de ${startHour} à ${endHour}`;
        }

        const singleHour = startHour || endHour;
        if (singleHour) {
            return lang === 'en' ? `at ${singleHour}` : `à ${singleHour}`;
        }
        return '';
    };

    const formattedDateRange = formatDateRange(news?.StartDate, news?.EndDate);
    const formattedHourRange = formatHourRange(news?.StartHour, news?.EndHour);

    // *** END — DATE FORMATTING ***

    useEffect(() => {
        if (!sectionRef.current) return;

        const trigger = ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top 100px',
            end: 'bottom 100px',
            onEnter: () => onActiveNewsChange?.(newsAnchor),
            onEnterBack: () => onActiveNewsChange?.(newsAnchor),
        });

        return () => {
            trigger.kill();
        };
    }, [newsAnchor, onActiveNewsChange]);

    // Fonction pour extraire le texte d'un noeud Rich Text
    const getNodeText = (node) => {
        if (!node) return '';
        if (node.type === 'text') return node.text ?? '';
        if (!Array.isArray(node.children)) return '';
        return node.children.map(getNodeText).join('');
    };

    // Fonction pour convertir un tableau de noeuds Rich Text en une chaîne de texte
    const getRichTextAsString = (richTextBlocks = []) => {
        return richTextBlocks.map(getNodeText).join(' ');
    };
    const newsText = getRichTextAsString(news?.Text ?? []);

    return (
        <section
            ref={sectionRef}
            id={newsAnchor}
            className='border scroll-mt-[calc(var(--spacing-header-height)+10px)] mt-[10px]'
        >
            <a
                href={`#${newsAnchor}`}
                className='block-title border-b border-transparent'
            >
                <h2 className='text-title text-center'>{news.Title}</h2>
            </a>

            <div>
                <Slider
                    items={images}
                    className=''
                    slideClassName='!w-fit'
                    spaceBetween={0}
                    renderSlide={(image, index) => (
                        <ImageSlider
                            image={image}
                            alt={news.Title || 'news image'}
                            className='w-auto h-[371px] object-cover'
                            preferredFormat='medium'
                            onClick={() => setLightboxIndex(index)}
                        />
                    )}
                />
                {lightboxIndex !== null && hasImages ? (
                    <Lightbox
                        images={images}
                        currentIndex={lightboxIndex}
                        alt={news.Title || 'news image'}
                        onClose={() => setLightboxIndex(null)}
                        onPrev={() =>
                            setLightboxIndex(
                                (prev) =>
                                    (prev - 1 + images.length) % images.length
                            )
                        }
                        onNext={() =>
                            setLightboxIndex(
                                (prev) => (prev + 1) % images.length
                            )
                        }
                    />
                ) : null}
                <div className='bg-linear-to-t from-primary to-light to-80% p-[10px]'>
                    <div className='md:grid md:grid-cols-6 md:gap-[10px]'>
                        <div className='md:col-span-4'>
                            <div className='max-w-[90%]'>
                                {newsText ? <p>{newsText}</p> : null}
                                {paragraphs.map((paragraph) => {
                                    const paragraphText = getRichTextAsString(
                                        paragraph?.Text ?? []
                                    );

                                    return (
                                        <article
                                            key={paragraph.id}
                                            className='mt-4'
                                        >
                                            {paragraph?.Subtitle ? (
                                                <h3 className='mb-h3-margin'>
                                                    {paragraph.Subtitle}
                                                </h3>
                                            ) : null}
                                            {paragraphText ? (
                                                <p>{paragraphText}</p>
                                            ) : null}
                                        </article>
                                    );
                                })}
                            </div>
                        </div>

                        <div className='md:col-span-2 grid grid-cols-2 md:gap-[10px] max-md:mt-[20px] max-md:mx-[-10px] max-md:bg-primary'>
                            <div className='col-span-1 max-md:bg-linear-to-t max-md:from-primary max-md:to-light max-md:to-80% max-md:p-[10px] max-md:h-fit'>
                                {news?.event_categories?.map((category) => (
                                    <p key={category.id}>{category.Name}</p>
                                ))}
                                {Array.isArray(news?.Links) &&
                                news.Links.length > 0 ? (
                                    <ul className='mt-4'>
                                        {news.Links.map((link) => (
                                            <li key={link.id}>
                                                <a
                                                    href={link.Url}
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                >
                                                    <span className='inline pr-h3-margin'>
                                                        &#8599;
                                                    </span>
                                                    {link.LinkTitle || link.Url}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                ) : null}
                            </div>
                            <div className='col-span-1 max-md:bg-linear-to-t max-md:from-primary max-md:to-light max-md:to-80% max-md:p-[10px] max-md:h-fit'>
                                {formattedDateRange || formattedHourRange ? (
                                    <>
                                        {formattedDateRange ? (
                                            <>
                                                <h3 className='mb-h3-margin'>
                                                    {lang === 'fr'
                                                        ? 'Date(s) :'
                                                        : 'Date(s) :'}
                                                </h3>
                                                <p> {formattedDateRange}</p>
                                            </>
                                        ) : null}

                                        {formattedHourRange ? (
                                            <>
                                                <p>{formattedHourRange}</p>
                                            </>
                                        ) : null}
                                    </>
                                ) : null}

                                {news?.Place ||
                                news?.Address ||
                                news?.Country ? (
                                    <>
                                        <h3 className='mb-h3-margin'>
                                            {lang === 'fr'
                                                ? 'Lieu :'
                                                : 'Location :'}
                                        </h3>
                                        <p>
                                            {news?.Place ? (
                                                <span>{news?.Place}</span>
                                            ) : null}
                                            <br></br>
                                            {news?.Address ? (
                                                <address className='not-italic inline pr-h3-margin'>
                                                    {news?.Address}
                                                </address>
                                            ) : null}
                                            {news?.Country ? (
                                                <span>{news?.Country}</span>
                                            ) : null}
                                        </p>
                                    </>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
                {Array.isArray(news?.RendezVous) && news.RendezVous.length > 0
                    ? news.RendezVous.map((rendezVous) => {
                          const rendezVousText = getRichTextAsString(
                              rendezVous?.Text ?? []
                          );
                          const rendezVousDate = formatDate(
                              parseIsoDate(rendezVous?.EventDate)
                          );
                          const rendezVousHourRange = formatHourRange(
                              rendezVous?.StartHour,
                              rendezVous?.EndHour
                          );

                          return (
                              <NewsRdvSection
                                  key={
                                      rendezVous?.id ??
                                      `${rendezVous?.Title ?? 'rendez-vous'}-${rendezVous?.EventDate ?? ''}`
                                  }
                                  rendezVous={rendezVous}
                                  rendezVousText={rendezVousText}
                                  rendezVousDate={rendezVousDate}
                                  rendezVousHourRange={rendezVousHourRange}
                                  lang={lang}
                              />
                          );
                      })
                    : null}
            </div>
        </section>
    );
}
