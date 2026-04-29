//src/components/features/news/NewsStickyNote.jsx
import { useEffect, useRef, useState } from 'react';

const NOTE_HEIGHT = 556;
const ENTRY_OFFSET = 40;

function MaskIcon({ src, className = '' }) {
    return (
        <span
            aria-hidden='true'
            className={`pointer-events-none block shrink-0 bg-current ${className}`}
            style={{
                maskImage: `url(${src})`,
                WebkitMaskImage: `url(${src})`,
                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat',
                maskPosition: 'center',
                WebkitMaskPosition: 'center',
                maskSize: 'contain',
                WebkitMaskSize: 'contain',
            }}
        />
    );
}

function toDisplayDate(value) {
    if (!value) return '';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return '';
    const day = String(parsed.getDate()).padStart(2, '0');
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const year = String(parsed.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
}

function toDisplayDateRange(startDate, endDate) {
    if (!startDate && !endDate) return '';

    const startParsed = startDate ? new Date(startDate) : null;
    const endParsed = endDate ? new Date(endDate) : null;
    const startValid = startParsed && !Number.isNaN(startParsed.getTime());
    const endValid = endParsed && !Number.isNaN(endParsed.getTime());

    if (startValid && endValid) {
        const sameYear = startParsed.getFullYear() === endParsed.getFullYear();

        if (sameYear) {
            const startDay = String(startParsed.getDate()).padStart(2, '0');
            const startMonth = String(startParsed.getMonth() + 1).padStart(
                2,
                '0'
            );
            const endDay = String(endParsed.getDate()).padStart(2, '0');
            const endMonth = String(endParsed.getMonth() + 1).padStart(2, '0');
            const year = String(startParsed.getFullYear());
            return `${startDay}/${startMonth}-${endDay}/${endMonth}/${year}`;
        }
    }

    const start = toDisplayDate(startDate);
    const end = toDisplayDate(endDate);
    if (start && end) return `${start}-${end}`;
    return start || end || '';
}

function toDisplayHour(value) {
    if (!value) return '';
    return String(value).slice(0, 5);
}

function toDisplayDateFullYear(value) {
    if (!value) return '';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return '';
    const day = String(parsed.getDate()).padStart(2, '0');
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const year = String(parsed.getFullYear());
    return `${day}/${month}/${year}`;
}

function toDisplayHourWithH(value) {
    const hour = toDisplayHour(value);
    return hour ? hour.replace(':', 'h') : '';
}

function toDisplayPlaceAndAddress(place, address) {
    const normalizedPlace = String(place || '').trim();
    const normalizedAddress = String(address || '')
        .trim()
        .replace(/,\s*(\d{4}\s)/, ' $1');
    return [normalizedPlace, normalizedAddress].filter(Boolean).join(', ');
}

function extractText(value) {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) {
        return value
            .map((item) => extractText(item))
            .filter(Boolean)
            .join(' ');
    }
    if (typeof value === 'object') {
        if (typeof value.text === 'string') return value.text;
        if (Array.isArray(value.children)) {
            return value.children
                .map((child) => extractText(child))
                .filter(Boolean)
                .join(' ');
        }
    }
    return '';
}

export default function NewsStickyNote({
    note,
    initialPosition,
    zIndex,
    onClose,
    onBringToFront,
}) {
    const [position, setPosition] = useState(initialPosition);
    const [hasEnteredViewport, setHasEnteredViewport] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isMobileViewport, setIsMobileViewport] = useState(false);
    const dragOffsetRef = useRef({ x: 0, y: 0 });
    const draggingRef = useRef(false);
    const rootRef = useRef(null);
    const closeTimeoutRef = useRef(null);
    const canDrag = !isMobileViewport;

    useEffect(() => {
        if (window.__coverAnimationHidden) {
            const rafId = window.requestAnimationFrame(() => {
                setHasEnteredViewport(true);
            });
            return () => {
                window.cancelAnimationFrame(rafId);
            };
        }

        const handleCoverHidden = () => {
            setHasEnteredViewport(true);
        };

        window.addEventListener('cover-animation-hidden', handleCoverHidden, {
            once: true,
        });

        return () => {
            window.removeEventListener(
                'cover-animation-hidden',
                handleCoverHidden
            );
        };
    }, []);

    useEffect(() => {
        return () => {
            if (closeTimeoutRef.current) {
                window.clearTimeout(closeTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 767px)');
        const updateViewport = () => {
            setIsMobileViewport(mediaQuery.matches);
        };

        updateViewport();
        mediaQuery.addEventListener('change', updateViewport);

        return () => {
            mediaQuery.removeEventListener('change', updateViewport);
        };
    }, []);

    useEffect(() => {
        const handlePointerMove = (event) => {
            if (!draggingRef.current) return;
            setPosition((current) => ({
                ...current,
                x: event.clientX - dragOffsetRef.current.x,
                y: event.clientY - dragOffsetRef.current.y,
            }));
        };

        const stopDragging = () => {
            draggingRef.current = false;
            setIsDragging(false);
        };

        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', stopDragging);
        window.addEventListener('pointercancel', stopDragging);

        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', stopDragging);
            window.removeEventListener('pointercancel', stopDragging);
        };
    }, []);

    const handlePointerDown = (event) => {
        if (event.button !== 0 || isClosing) return;
        onBringToFront?.(note.id);
        if (!canDrag) return;

        const rect = rootRef.current?.getBoundingClientRect();
        if (!rect) return;

        draggingRef.current = true;
        setIsDragging(true);
        dragOffsetRef.current = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
    };

    const handleClose = () => {
        if (isClosing) return;
        draggingRef.current = false;
        setIsDragging(false);
        setIsClosing(true);

        closeTimeoutRef.current = window.setTimeout(() => {
            onClose?.(note.id);
        }, 450);
    };

    const handleClosePointerDown = (event) => {
        event.stopPropagation();
        draggingRef.current = false;
        setIsDragging(false);
    };

    const yPosition = isClosing
        ? -NOTE_HEIGHT - ENTRY_OFFSET
        : hasEnteredViewport
            ? position.y
            : -NOTE_HEIGHT - ENTRY_OFFSET;
    const places = [
        note.Place,
        ...(Array.isArray(note.RendezVous)
            ? note.RendezVous.map((item) => item?.Place)
            : []),
    ].reduce(
        (acc, place) => {
            const normalized = String(place || '').trim();
            const key = normalized.toLowerCase();
            if (!normalized || acc.seen.has(key)) return acc;
            acc.seen.add(key);
            acc.values.push(normalized);
            return acc;
        },
        { seen: new Set(), values: [] }
    ).values;
    const firstImage = Array.isArray(note.Images) ? note.Images[0] : null;
    const firstImageUrl =
        firstImage?.url ||
        firstImage?.formats?.large?.url ||
        firstImage?.formats?.medium?.url ||
        firstImage?.formats?.small?.url ||
        firstImage?.formats?.thumbnail?.url ||
        '';

    return (
        <article
            ref={rootRef}
            className={`fixed w-full max-w-139 border border-black bg-linear-to-b from-primary from-0% via-primary via-66% to-light to-100% text-base shadow-[0_10px_30px_rgba(0,0,0,0.2)] ${canDrag ? 'cursor-grab active:cursor-grabbing' : ''}`}
            style={{
                transform: `translate3d(${position.x}px, ${yPosition}px, 0) rotate(${position.rotation ?? 0}deg)`,
                transition: isDragging
                    ? 'none'
                    : 'transform 450ms cubic-bezier(0.22, 1, 0.36, 1)',
                zIndex,
                touchAction: canDrag ? 'none' : 'auto',
                pointerEvents: isClosing ? 'none' : 'auto',
                width: 'min(556px, calc(100vw - 2rem), calc(100dvh - 2rem))',
                aspectRatio: '1 / 1',
            }}
            onPointerDown={handlePointerDown}
        >
            <button
                type='button'
                onPointerDown={handleClosePointerDown}
                onClick={handleClose}
                className='absolute top-2.5 right-2.5 z-20 flex h-9 w-9 cursor-pointer items-center justify-center text-black transition-colors duration-200 hover:text-gray-300'
                aria-label='Fermer le post-it'
            >
                <MaskIcon src='/svg/croix.svg' className='h-6.5 w-6.5' />
            </button>

            <div className='h-full overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'>
                <div className='post-it-chapo p-[20px] lg:p-[40px] bg-linear-to-b from-primary from-0% via-primary via-66% to-light to-100% flex flex-col gap-[10px]'>

                    <h3 className='post-it-title text-title'>{note.Title}</h3>

                    <div className='flex flex-col gap-[23px]'>
                        <div>

                            {note.event_categories?.[0]?.Name ||
                                note.event_categories?.[0]?.attributes?.Name ? (
                                <p className='post-it-category'>
                                    {note.event_categories?.[0]?.Name ||
                                        note.event_categories?.[0]?.attributes?.Name}
                                </p>
                            ) : null}
                            <div className='flex flex-col gap-[10px]'>
                                {toDisplayDateRange(note.StartDate, note.EndDate) ? (
                                    <p className='post-it-date'>
                                        {toDisplayDateRange(note.StartDate, note.EndDate)}
                                    </p>
                                ) : null}
                                {places.length ? (
                                    <p className='post-it-place'>{places.join(', ')}</p>
                                ) : null}
                            </div>
                        </div>

                        {extractText(note.Text) ? (
                            <p className='post-it-text'>{extractText(note.Text)}</p>
                        ) : null}

                        {Array.isArray(note.Links) && note.Links.length ? (
                            <ul className='post-it-links-list'>
                                {note.Links.map((link, index) => (
                                    <li
                                        className='post-it-links-list-item'
                                        key={link.id || index}
                                    >
                                        <a
                                            href={link.Url}
                                            target='_blank'
                                            rel='noreferrer'
                                        >
                                            {`→ ${link.LinkTitle || 'Ouvrir le lien'}`}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        ) : null}

                        {firstImageUrl ? (
                            <img
                                src={firstImageUrl}
                                alt={
                                    firstImage?.alternativeText || note.Title || ''
                                }
                                className='pointer-events-none h-[400px] w-full object-contain object-left'
                                loading='lazy'
                                draggable={false}
                                onDragStart={(event) => event.preventDefault()}
                            />
                        ) : null}
                    </div>

                </div>

                {Array.isArray(note.RendezVous) && note.RendezVous.length ? (
                    <div className='post-it-rendez-vous-section'>
                        {note.RendezVous.map((item, index) => (
                            <div
                                className='post-it-rendez-vous p-[20px] lg:p-[40px] bg-linear-to-b from-primary from-0% via-primary via-66% to-light to-100% flex flex-col gap-[10px]'
                                key={item.id || index}
                            >
                                <div className='flex flex-col gap-[10px]'>
                                    {item.Title ? (
                                        <h4 className='post-it-rendez-vous-title text-title'>
                                            {item.Title}
                                        </h4>
                                    ) : null}

                                    {item.EventDate ||
                                        item.StartHour ||
                                        item.EndHour ? (
                                        <p className='post-it-rendez-vous-date'>
                                            {[
                                                toDisplayDateFullYear(
                                                    item.EventDate
                                                ),
                                                item.StartHour || item.EndHour
                                                    ? `${toDisplayHourWithH(item.StartHour)} - ${toDisplayHourWithH(item.EndHour)}`
                                                    : '',
                                            ]
                                                .filter(Boolean)
                                                .join(', ')}
                                        </p>
                                    ) : null}
                                    {toDisplayPlaceAndAddress(
                                        item.Place,
                                        item.Address
                                    ) ? (
                                        <p className='post-it-rendez-vous-place'>
                                            {toDisplayPlaceAndAddress(
                                                item.Place,
                                                item.Address
                                            )}
                                        </p>
                                    ) : null}

                                </div>


                                {item.Text ? (
                                    <p className='post-it-rendez-vous-text'>
                                        {extractText(item.Text)}
                                    </p>
                                ) : null}
                            </div>
                        ))}
                    </div>
                ) : null}
            </div>
        </article>
    );
}
