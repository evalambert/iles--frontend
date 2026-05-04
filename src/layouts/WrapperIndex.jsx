//src/layouts/WrapperIndex.jsx
import { useState } from 'react';
import NavIndex from '../components/features/navigation/NavIndex';
import About from './About.jsx';
import Members from './Members';
import NewsStickyOverlay from '../components/features/news/NewsStickyOverlay';

export default function WrapperIndex({ about, members, lang, news = [] }) {
    const [selectedPractice, setSelectedPractice] = useState('');
    const [activeAboutAnchor, setActiveAboutAnchor] = useState('');
    const [activeMemberAnchor, setActiveMemberAnchor] = useState('');

    return (
        <div className='lg:grid lg:grid-cols-6'>
            <NewsStickyOverlay lang={lang} news={news} />
            
            {/* Navigation */}
            <div className='lg:col-span-2 lg:h-[calc(100vh-var(--spacing-header-height))] lg:sticky top-0'>
                <NavIndex
                    about={about}
                    members={members}
                    lang={lang}
                    selectedPractice={selectedPractice}
                    activeAboutAnchor={activeAboutAnchor}
                    activeMemberAnchor={activeMemberAnchor}
                    onPracticeSelect={setSelectedPractice}
                />
            </div>

            {/* Content */}
            <div className='lg:col-span-4'>
                <About data={about} lang={lang} onActiveAboutChange={setActiveAboutAnchor} />
                <Members
                    data={members}
                    lang={lang}
                    selectedPractice={selectedPractice}
                    onActiveMemberChange={setActiveMemberAnchor}
                />
            </div>
        </div>
    );
}
