//src/layouts/WrapperIndex.jsx
import NavIndex from '../components/features/navigation/NavIndex';
import About from './About.jsx';
import Members from './Members';

export default function WrapperIndex({ about, members, lang }) {
    return (
        <div className='lg:grid lg:grid-cols-6'>
            
            {/* Navigation */}
            <div className='lg:col-span-2 lg:h-[calc(100vh-var(--spacing-header-height))] lg:sticky top-0'>
                <NavIndex about={about} members={members} lang={lang}/>
            </div>

            {/* Content */}
            <div className='lg:col-span-4'>
                <About data={about} lang={lang} />
                <Members data={members} lang={lang} />
            </div>
        </div>
    );
}
