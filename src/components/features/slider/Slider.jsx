//src/components/features/slider/Slider.jsx
import { useId } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function MaskIcon({ src, className = '' }) {
    return (
        <span
            aria-hidden='true'
            className={`pointer-events-none block shrink-0 bg-current hover:bg-primary ${className}`}
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

export default function Slider({
    items = [],
    renderSlide,
    slidesPerView = 'auto',
    spaceBetween = 0,
    navigation = true,
    pagination = false,
    loop = false,
    className = '',
    slideClassName = '',
    slideSeparatorClassName = '',
    prevIconSrc = '/svg/fleche-guauche.svg',
    nextIconSrc = '/svg/fleche-droite.svg',
    arrowClassName = '',
    swiperRef = null,
    onSwiper = null,
}) {
    if (
        !Array.isArray(items) ||
        !items.length ||
        typeof renderSlide !== 'function'
    ) {
        return null;
    }

    const sliderId = useId().replace(/:/g, '');
    const prevClassName = `swiper-prev-${sliderId}`;
    const nextClassName = `swiper-next-${sliderId}`;
    const canNavigate = navigation && items.length > 1;
    const navigationConfig = canNavigate
        ? {
              prevEl: `.${prevClassName}`,
              nextEl: `.${nextClassName}`,
          }
        : false;

    return (
        <div className='relative'>
            {canNavigate ? (
                <>
                    <button
                        type='button'
                        className={`${prevClassName} slider-arrow absolute left-0 top-1/2 z-10 -translate-y-1/2 p-[15px] cursor-pointer text-black transition-colors duration-200 hover:[&>span]:bg-primary ${arrowClassName}`}
                        aria-label='Slide precedente'
                    >
                        <MaskIcon
                            src={prevIconSrc}
                            className='h-19.5 w-y-body'
                        />
                    </button>
                    <button
                        type='button'
                        className={`${nextClassName} slider-arrow absolute right-0 top-1/2 z-10 -translate-y-1/2 p-[15px] cursor-pointer text-black transition-colors duration-200 hover:[&>span]:bg-primary ${arrowClassName}`}
                        aria-label='Slide suivante'
                    >
                        <MaskIcon
                            src={nextIconSrc}
                            className='h-19.5 w-y-body'
                        />
                    </button>
                </>
            ) : null}

            <Swiper
                modules={[Navigation, Pagination, A11y]}
                slidesPerView={slidesPerView}
                spaceBetween={spaceBetween}
                navigation={navigationConfig}
                pagination={pagination}
                loop={loop}
                observer={true}
                observeParents={true}
                resizeObserver={true}
                className={className}
                onSwiper={(swiper) => {
                    if (swiperRef) {
                        swiperRef.current = swiper;
                    }
                    if (typeof onSwiper === 'function') {
                        onSwiper(swiper);
                    }
                }}
            >
                {items.map((item, index) => (
                    <SwiperSlide
                        key={item?.id ?? index}
                        className={`${slideClassName} ${index < items.length - 1 ? slideSeparatorClassName : ''}`}
                    >
                        {renderSlide(item, index)}
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
