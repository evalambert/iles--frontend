import { Fragment } from 'react';

/**
 * Rendu des blocs rich text renvoyés par Strapi (paragraph / text / link).
 */
export function renderStrapiRichTextBlocks(blocks) {
    if (!blocks) return null;
    if (typeof blocks === 'string') return <p>{blocks}</p>;
    if (!Array.isArray(blocks) || blocks.length === 0) return null;

    const renderRichTextChildren = (children = []) =>
        (Array.isArray(children) ? children : []).map((child, idx) => {
            if (!child) return null;
            if (child.type === 'text') {
                return <Fragment key={idx}>{child.text ?? ''}</Fragment>;
            }

            if (child.type === 'link') {
                const href = child.url ?? child.href ?? '';
                const target = child.target;
                const rel = target === '_blank' ? 'noopener noreferrer' : undefined;

                return (
                    <a key={idx} href={href} target={target} rel={rel}>
                        {(Array.isArray(child.children) ? child.children : []).map(
                            (linkChild, linkChildIdx) => {
                                if (!linkChild) return null;
                                if (linkChild.type === 'text') {
                                    return (
                                        <Fragment key={linkChildIdx}>
                                            {linkChild.text ?? ''}
                                        </Fragment>
                                    );
                                }
                                return null;
                            }
                        )}
                    </a>
                );
            }

            return null;
        });

    return blocks.map((block, idx) => {
        if (!block || block.type !== 'paragraph') return null;
        return (
            <p key={idx}>
                {renderRichTextChildren(block.children)}
            </p>
        );
    });
}
