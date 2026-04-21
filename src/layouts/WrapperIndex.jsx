//src/layouts/WrapperIndex.jsx
import NavIndex from '../components/features/navigation/NavIndex';
import About from './About.jsx';
import Members from './Members';

export default function WrapperIndex({ about, members }) {
    return (
        <div className='border-2 border-black'>
            <h1 className='color'>WrapperIndex</h1>
            <NavIndex />
            <div>
                <Members data={members} />
                <About data={about} />
            </div>
        </div>
    );
}
