//src/components/common/TitleBlock.jsx
import { normalizeAnchor } from '../../assets/scripts/utils/normalizeAnchor';

export default function TitleBlock({ title}) {
    return (
        
        <a href={`#${normalizeAnchor(title)}`} className="block border-b bg-linear-to-t from-primary to-white to-40% py-[15px] px-[10px] min-h-header-height">
        <h2 className="text-title text-center"> 
            {title}
        </h2>
        </a>
    );
}