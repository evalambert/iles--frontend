//src/components/features/news/NewsStickyNote.jsx
import { useEffect, useRef, useState } from 'react';

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
            setPosition({
                x: event.clientX - dragOffsetRef.current.x,
                y: event.clientY - dragOffsetRef.current.y,
            });
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

    return (
        <article
            ref={rootRef}
            className='fixed w-[340px] max-w-[90vw] border border-black bg-primary p-4 text-sm shadow-[0_10px_30px_rgba(0,0,0,0.2)] select-none'
            style={{
                transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
                zIndex,
                touchAction: 'none',
            }}
            onPointerDown={handlePointerDown}
        >
            <button
                type='button'
                onClick={handleClose}
                className='absolute top-2 right-2 flex h-7 w-7 cursor-pointer items-center justify-center border border-black bg-light text-xl leading-none'
                aria-label='Fermer le post-it'
            >
                x
            </button>

            {note.date ? <p className='mb-1 text-xs'>{note.date}</p> : null}
            <h3 className='mb-1 pr-8 text-[32px] leading-[1]'>{note.title}</h3>
            {note.author ? <p className='mb-2'>{note.author}</p> : null}
            <p className='leading-tight'>{note.excerpt}</p>
        </article>
    );
}
