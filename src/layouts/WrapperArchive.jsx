//src/layouts/WrapperArchive.jsx

import { useState } from 'react';
import NavArchive from '../components/features/navigation/NavArchive.jsx';
import Archive from '../layouts/Archive.jsx';

export default function WrapperArchive({ news, lang }) {
    const [selectedPeriod, setSelectedPeriod] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [activeNewsAnchor, setActiveNewsAnchor] = useState('');

    return (
        <div className='lg:grid lg:grid-cols-6'>
            {/* Navigation */}
            <div className='lg:col-span-2 lg:h-[calc(100vh-var(--spacing-header-height))] lg:sticky top-0'>
                <NavArchive 
                    news={news}
                    lang={lang}
                    selectedPeriod={selectedPeriod}
                    selectedCategory={selectedCategory}
                    activeNewsAnchor={activeNewsAnchor}
                    onPeriodSelect={setSelectedPeriod}
                    onCategorySelect={setSelectedCategory}
                />
            </div>

            {/* Content */}
            <div className='lg:col-span-4'>
                <Archive
                    news={news}
                    lang={lang}
                    selectedPeriod={selectedPeriod}
                    selectedCategory={selectedCategory}
                    onActiveNewsChange={setActiveNewsAnchor}
                />
            </div>
        </div>
    );
}

