//src/components/features/about/AboutSection.jsx

import { normalizeAnchor } from '../../../assets/scripts/utils/normalizeAnchor';

export default function AboutSection({ title, chapo, paragraphs, images }) {

    // Fonction pour extraire le texte d'un noeud Rich Text
    const getNodeText = (node) => {
        if (!node) return '';
        if (node.type === 'text') return node.text ?? '';
        if (!Array.isArray(node.children)) return '';
        return node.children.map(getNodeText).join('');
    };

    // Fonction pour convertir un tableau de noeuds Rich Text en une chaîne de texte
    const getRichTextAsString = (richTextBlocks = []) => {
        return richTextBlocks.map(getNodeText).join(' ');
    };

    return (

        <section id={normalizeAnchor(title)} className="border text-blue-300 scroll-mt-header-height">

            <h2>{title}</h2>

            {chapo ? <p>{chapo}</p> : null}

            {paragraphs.map((paragraph) => {
                const paragraphText = getRichTextAsString(paragraph?.Text ?? []);

                return (
                    <article key={paragraph.id} className="mt-4">
                        {paragraph?.Subtitle ? <h3>{paragraph.Subtitle}</h3> : null}
                        {paragraphText ? <p>{paragraphText}</p> : null}
                    </article>
                );
            })}

            {images.map((image) => {
                const src =
                    image?.formats?.medium?.url ??
                    image?.formats?.large?.url ??
                    image?.formats?.small?.url ??
                    image?.url ??
                    '';

                if (!src) return null;

                return (
                    <img
                        key={image.id}
                        src={src}
                        alt={image?.alternativeText ?? image?.name ?? ''}
                        loading="lazy"
                    />
                );
            })}
        </section>

    );
}