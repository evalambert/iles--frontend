//src/components/common/TitleBlock.jsx
import { normalizeAnchor } from '../../assets/scripts/utils/normalizeAnchor';

export default function TitleBlock({ title }) {
    return (

        <a href={`#${normalizeAnchor(title)}`} className="block-title">
            <h2>
                {title}
            </h2>
        </a>
    );
}