//src/components/features/animation/CoverAnimation.jsx
import { useEffect, useRef, useState } from 'react';

export default function CoverAnimation() {
    const [isFadingOut, setIsFadingOut] = useState(false);
    const hideTimeoutRef = useRef(null);
    const autoFadeTimeoutRef = useRef(null);

    const handleFadeOut = () => {
        setIsFadingOut((current) => {
            if (current) return current;

            hideTimeoutRef.current = window.setTimeout(() => {
                window.__coverAnimationHidden = true;
                window.dispatchEvent(new CustomEvent('cover-animation-hidden'));
            }, 300);

            return true;
        });
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.__coverAnimationHidden = false;
        }

        autoFadeTimeoutRef.current = window.setTimeout(() => {
            handleFadeOut();
        }, 4100);

        return () => {
            if (autoFadeTimeoutRef.current) {
                window.clearTimeout(autoFadeTimeoutRef.current);
            }
            if (hideTimeoutRef.current) {
                window.clearTimeout(hideTimeoutRef.current);
            }
        };
    }, []);

    return (
        <>
            <div
                id="cover-animation"
                onClick={handleFadeOut}
                className={`z-50 w-full h-full fixed top-0 left-0 bg-linear-to-t from-[#e9fe00f3] to-[#ffffff00] from-50% flex items-center justify-center transition-opacity duration-1000 ${isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
                    }`}
            >
                <img src="/animation/iles-mardi--cover-big.gif" alt="Îles MARDI" className="w-[90vw] h-auto border-0 pointer-events-none" />

                

            </div> 
        </>
    );
}