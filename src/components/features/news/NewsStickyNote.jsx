//src/components/features/news/NewsStickyNote.jsx
import { useEffect, useRef, useState } from 'react';

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
            const year = String(startParsed.getFullYear()).slice(-2);
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
    const dragOffsetRef = useRef({ x: 0, y: 0 });
    const draggingRef = useRef(false);
    const rootRef = useRef(null);

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
        if (event.button !== 0) return;

        const rect = rootRef.current?.getBoundingClientRect();
        if (!rect) return;

        draggingRef.current = true;
        dragOffsetRef.current = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
        onBringToFront?.(note.id);
    };

    const handleClose = () => {
        onClose?.(note.id);
    };

    const handleClosePointerDown = (event) => {
        event.stopPropagation();
        draggingRef.current = false;
    };

    return (
        <article
            ref={rootRef}
            className='fixed h-[556px] w-[556px] border border-black bg-linear-to-b from-primary from-0% via-primary via-66% to-light to-100% p-4 text-sm shadow-[0_10px_30px_rgba(0,0,0,0.2)]'
            style={{
                transform: `translate3d(${position.x}px, ${position.y}px, 0) rotate(${position.rotation ?? 0}deg)`,
                zIndex,
                touchAction: 'none',
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
                <MaskIcon src='/svg/croix.svg' className='h-x-body w-6.5' />
            </button>

            <div className='h-full overflow-y-auto'>
                <h3 className='text-title'>{note.Title || ''}</h3>
                {note.Place || note.Address ? (
                    <p className=''>{note.Place || note.Address}</p>
                ) : null}
                {toDisplayDateRange(note.StartDate, note.EndDate) ? (
                    <p className=''>
                        {toDisplayDateRange(note.StartDate, note.EndDate)}
                    </p>
                ) : null}

                {extractText(note.Text) ? (
                    <p className=''>{extractText(note.Text)}</p>
                ) : null}

                {Array.isArray(note.Paragraphs) && note.Paragraphs.length ? (
                    <div className=''>
                        {note.Paragraphs.map((paragraph, index) => (
                            <div key={paragraph.id || index}>
                                {paragraph.Subtitle ? (
                                    <p className=''>{paragraph.Subtitle}</p>
                                ) : null}
                                {paragraph.Text ? (
                                    <p className=''>
                                        {extractText(paragraph.Text)}
                                    </p>
                                ) : null}
                            </div>
                        ))}
                    </div>
                ) : null}

                {Array.isArray(note.RendezVous) && note.RendezVous.length ? (
                    <div className='pb-4'>
                        {note.RendezVous.map((item, index) => (
                            <div key={item.id || index}>
                                {item.Title ? (
                                    <h4 className=''>{item.Title}</h4>
                                ) : null}
                                <p>{toDisplayDate(item.EventDate)}</p>
                                <p>
                                    {item.StartHour || item.EndHour
                                        ? `${toDisplayHour(item.StartHour)}-${toDisplayHour(item.EndHour)}`
                                        : ''}
                                </p>
                                {[item.Place, item.Address]
                                    .filter(Boolean)
                                    .join(', ') ? (
                                    <p>
                                        {[item.Place, item.Address]
                                            .filter(Boolean)
                                            .join(', ')}
                                    </p>
                                ) : null}
                                {item.Text ? (
                                    <p>{extractText(item.Text)}</p>
                                ) : null}
                            </div>
                        ))}
                    </div>
                ) : null}

                {Array.isArray(note.Links) && note.Links.length ? (
                    <div>
                        <ul>
                            {note.Links.map((link, index) => (
                                <li key={link.id || index}>
                                    {link.LinkTitle
                                        ? `${link.LinkTitle}: `
                                        : ''}
                                    <a
                                        href={link.Url}
                                        target='_blank'
                                        rel='noreferrer'
                                    >
                                        {link.Url}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : null}
            </div>
        </article>
    );
}
