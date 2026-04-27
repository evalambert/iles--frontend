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
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const day = String(parsed.getDate()).padStart(2, '0');
    const year = String(parsed.getFullYear()).slice(-2);
    return `${month}/${day}/${year}`;
}

function toDisplayDateRange(startDate, endDate) {
    const start = toDisplayDate(startDate);
    const end = toDisplayDate(endDate);
    if (start && end) return `${start} - ${end}`;
    return start || end || '';
}

function toDisplayHour(value) {
    if (!value) return '';
    return String(value).slice(0, 5);
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

    const displayDate = toDisplayDateRange(note?.StartDate, note?.EndDate);
    const displayTitle = note?.Title || '';
    const displaySecondary = note?.Place || note?.Address || '';
    const displayText = note?.Text || '';
    const displayCountryCity = [note?.Country, note?.City]
        .filter(Boolean)
        .join(', ');
    const categories = Array.isArray(note?.event_categories)
        ? note.event_categories
        : [];
    const paragraphs = Array.isArray(note?.Paragraphs) ? note.Paragraphs : [];
    const links = Array.isArray(note?.Links) ? note.Links : [];
    const rendezVous = Array.isArray(note?.RendezVous) ? note.RendezVous : [];

    return (
        <article
            ref={rootRef}
            className='fixed h-[556px] w-[556px] border border-black bg-primary p-4 text-sm shadow-[0_10px_30px_rgba(0,0,0,0.2)]'
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
                {displayDate ? <p className=''>{displayDate}</p> : null}
                <h3 className='text-title'>{displayTitle}</h3>
                {displaySecondary ? (
                    <p className=''>{displaySecondary}</p>
                ) : null}

                {/*  {note?.Address ? <p className=''>{note.Address}</p> : null}
                {displayCountryCity ? (
                    <p className=''>{displayCountryCity}</p>
                ) : null} */}

                {displayText ? <p className=''>{displayText}</p> : null}

                {/*   {categories.length ? (
                    <div className='mb-3'>
                        <p className='mb-1 text-xs font-semibold'>Categories</p>
                        <ul className='space-y-1 text-xs'>
                            {categories.map((category) => (
                                <li key={category.id || category.Name}>
                                    {category.Name}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : null} */}

                {paragraphs.length ? (
                    <div className=''>
                        {paragraphs.map((paragraph, index) => (
                            <div key={paragraph.id || index}>
                                {paragraph.Subtitle ? (
                                    <p className=''>{paragraph.Subtitle}</p>
                                ) : null}
                                {paragraph.Text ? (
                                    <p className=''>{paragraph.Text}</p>
                                ) : null}
                            </div>
                        ))}
                    </div>
                ) : null}

                {rendezVous.length ? (
                    <div className=''>
                        <p className=''>RendezVous</p>
                        <div className=''>
                            {rendezVous.map((item, index) => (
                                <div key={item.id || index}>
                                    {item.Title ? (
                                        <p className=''>{item.Title}</p>
                                    ) : null}
                                    <p>
                                        {toDisplayDate(item.EventDate)}
                                        {item.StartHour || item.EndHour
                                            ? ` ${toDisplayHour(item.StartHour)}-${toDisplayHour(item.EndHour)}`
                                            : ''}
                                    </p>
                                    {item.Place ? <p>{item.Place}</p> : null}
                                    {item.Address ? (
                                        <p>{item.Address}</p>
                                    ) : null}
                                    {item.Text ? (
                                        <p className=''>{item.Text}</p>
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : null}

                {links.length ? (
                    <div className=''>
                        <p className=''>Liens</p>
                        <ul className=''>
                            {links.map((link, index) => (
                                <li key={link.id || index}>
                                    {link.LinkTitle
                                        ? `${link.LinkTitle}: `
                                        : ''}
                                    <a
                                        href={link.Url}
                                        target='_blank'
                                        rel='noreferrer'
                                        className=''
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
