import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import BannerAd from './ads/BannerAd';

interface MarkdownRendererProps {
    content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
    // Fix for template literal indentation:
    // This strips the common leading whitespace from every line so it isn't treated as a code block.
    const normalizeContent = (text: string) => {
        if (!text) return '';

        // Remove uniform indentation
        const lines = text.split('\n');

        // Find the minimum indent of non-empty lines, strictly skipping the first line
        // because in template literals the first line (Title) often starts immediately after the backtick.
        let minIndentLength = null;

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            if (line.trim().length === 0) continue;

            const match = line.match(/^(\s+)/);
            const currentIndent = match ? match[1].length : 0;

            if (minIndentLength === null || currentIndent < minIndentLength) {
                minIndentLength = currentIndent;
            }
        }

        // If no indentation found or it's 0, return original
        if (minIndentLength === null || minIndentLength === 0) return text;

        // Create regex to strip exactly that many spaces from start of every line
        const regex = new RegExp(`^\\s{${minIndentLength}}`, 'gm');
        return text.replace(regex, '');
    };

    const cleanContent = normalizeContent(content);

    // Split content by the ad placeholder
    const parts = cleanContent.split('### [BLOG_BANNER_AD]');

    const renderMarkdown = (text: string) => (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                img: ({ node, src, alt, ...props }) => (
                    <span className="block my-8">
                        <LazyLoadImage
                            src={src}
                            alt={alt}
                            effect="blur"
                            wrapperClassName="w-full"
                            className="rounded-xl shadow-2xl mx-auto"
                            width="100%"
                            {...props}
                        />
                    </span>
                ),
                a: ({ node, className, children, ...props }) => {
                    const href = props.href || '';
                    const isExternal = href.startsWith('http');
                    return (
                        <a
                            className={className}
                            {...props}
                            target={isExternal ? "_blank" : undefined}
                            rel={isExternal ? "noopener noreferrer" : undefined}
                        >
                            {children}
                        </a>
                    );
                }
            }}
        >
            {text}
        </ReactMarkdown>
    );

    return (
        <article className="prose prose-invert prose-lg max-w-none
            prose-headings:text-white prose-headings:font-bold
            prose-h1:text-4xl prose-h1:mb-6
            prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:text-cyan-400
            prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
            prose-p:text-gray-300 prose-p:leading-normal prose-p:mb-4
            prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:text-cyan-300 hover:prose-a:underline
            prose-strong:text-white prose-strong:font-bold
            prose-ul:list-disc prose-ul:pl-6 prose-ul:text-gray-300 prose-ul:mb-4
            prose-ol:list-decimal prose-ol:pl-6 prose-ol:text-gray-300 prose-ol:mb-4
            prose-li:mb-1
            prose-blockquote:border-l-4 prose-blockquote:border-cyan-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-400 prose-blockquote:bg-gray-800/50 prose-blockquote:py-2 prose-blockquote:rounded-r-lg
            prose-img:rounded-xl prose-img:shadow-2xl prose-img:mx-auto
            prose-code:text-cyan-300 prose-code:bg-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-700
            prose-table:w-full prose-table:text-left prose-table:border-collapse prose-table:border prose-table:border-gray-700
            prose-th:bg-gray-800 prose-th:p-4 prose-th:text-white prose-th:border prose-th:border-gray-700
            prose-td:p-4 prose-td:text-gray-300 prose-td:border prose-td:border-gray-700
            ">
            {parts.map((part, index) => (
                <React.Fragment key={index}>
                    {renderMarkdown(part)}
                    {index < parts.length - 1 && (
                        <BannerAd className="my-12 overflow-hidden" />
                    )}
                </React.Fragment>
            ))}
        </article>
    );
};

export default MarkdownRenderer;
