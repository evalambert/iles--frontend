//src/components/features/slider/Slider.jsx
import { useId } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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
    const navigationConfig = navigation
        ? {
              prevEl: `.${prevClassName}`,
              nextEl: `.${nextClassName}`,
          }
        : false;

    return (
        <div className='relative'>
            {navigation ? (
                <>
                    <button
                        type='button'
                        className={`${prevClassName} absolute left-2 top-1/2 z-10 -translate-y-1/2 ${arrowClassName}`}
                        aria-label='Slide precedente'
                    >
                        <img src={prevIconSrc} alt='' aria-hidden='true' />
                    </button>
                    <button
                        type='button'
                        className={`${nextClassName} absolute right-2 top-1/2 z-10 -translate-y-1/2 ${arrowClassName}`}
                        aria-label='Slide suivante'
                    >
                        <img src={nextIconSrc} alt='' aria-hidden='true' />
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
                className={className}
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
