//src/components/features/animation/CoverAnimation.jsx
import { useState } from 'react';

export default function CoverAnimation() {
    const [isFadingOut, setIsFadingOut] = useState(false);

    return (
        <div
            id="cover-animation"
            onClick={() => setIsFadingOut(true)}
            className={`w-full h-full fixed top-0 left-0 bg-linear-to-t from-primary to-light to-80% z-50 flex items-center justify-center transition-opacity duration-300 ${
                isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
        >
            
            <iframe
                src="https://lottie.host/embed/b731ccaf-82c9-4df2-8613-81ff81cd8912/4OgzlimggT.lottie"
                title="Cover animation"
                className="w-[40vw] h-[40vh] border-0 pointer-events-none"
            />
             

            {/* 
            <DotLottieReact
                src="https://lottie.host/b731ccaf-82c9-4df2-8613-81ff81cd8912/4OgzlimggT.lottie"
                loop
                autoplay
            />
            */}


        </div>
    );
}