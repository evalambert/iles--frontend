//src/components/features/animation/HeaderAnimation.jsx
import { useEffect, useState } from 'react';

export default function HeaderAnimation() {
    const [shouldAnimate, setShouldAnimate] = useState(false);

    useEffect(() => {
        const revealGif = () => setShouldAnimate(true);

        if (window.__coverAnimationHidden) {
            revealGif();
            return;
        }

        window.addEventListener('cover-animation-hidden', revealGif);
        return () => {
            window.removeEventListener('cover-animation-hidden', revealGif);
        };
    }, []);

    return (
        <div className="w-auto max-h-[calc(var(--spacing-header-height)-1px)]">
            {shouldAnimate ? (
                <img
                    src="/animation/iles-mardi.gif"
                    alt="Îles MARDI"
                    className="w-auto max-h-[calc(var(--spacing-header-height)-1px)]"
                />
            ) : (
                <img
                    src="/animation/iles-mardi.png"
                    alt="Îles MARDI"
                    className="w-auto max-h-[calc(var(--spacing-header-height)-1px)]"
                />
            )}
        </div>
    );
}