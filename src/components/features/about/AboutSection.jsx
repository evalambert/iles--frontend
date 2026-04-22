//src/components/features/about/AboutSection.jsx


import { normalizeAnchor } from '../../../assets/scripts/utils/normalizeAnchor';
import ImageSlider from '../../common/ImageSlider';
import Slider from '../slider/Slider';


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
                const paragraphText = getRichTextAsString(
                    paragraph?.Text ?? []
                );

                return (
                    <article key={paragraph.id} className='mt-4'>
                        {paragraph?.Subtitle ? (
                            <h3>{paragraph.Subtitle}</h3>
                        ) : null}
                        {paragraphText ? <p>{paragraphText}</p> : null}
                    </article>
                );
            })}

            <Slider
                items={images}
                className=''
                slideClassName='!w-fit'
                slideSeparatorClassName='border-r border-black'
                spaceBetween={0}
                renderSlide={(image) => (
                    <ImageSlider
                        image={image}
                        alt={title || 'about image'}
                        className='w-auto h-[742px] object-cover'
                    />
                )}
            /> 
        </section>
    );
}
