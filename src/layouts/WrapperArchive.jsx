//src/layouts/WrapperArchive.jsx

import NavArchive from '../components/features/navigation/NavArchive.jsx';
import Archive from '../layouts/Archive.jsx';

export default function WrapperArchive() {
    return (
        <div className='lg:grid lg:grid-cols-6'>
            {/* Navigation */}
            <div className='lg:col-span-2 lg:h-[calc(100vh-var(--spacing-header-height))] lg:sticky top-0'>
                <NavArchive />
            </div>

            {/* Content */}
            <div className='lg:col-span-4'>
                <Archive />
            </div>
        </div>
    );
}

