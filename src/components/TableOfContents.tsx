import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface TOCItem {
    id: string;
    text: string;
    level: number;
}

interface TableOfContentsProps {
    content: string;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ content }) => {
    const [headings, setHeadings] = useState<TOCItem[]>([]);
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        // Extract headings from markdown content
        const headingRegex = /^(#{2,3})\s+(.+)$/gm;
        const extractedHeadings: TOCItem[] = [];
        let match;

        while ((match = headingRegex.exec(content)) !== null) {
            const level = match[1].length;
            const text = match[2].trim();
            const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');

            if (level === 2 || level === 3) {
                extractedHeadings.push({ id, text, level });
            }
        }

        setHeadings(extractedHeadings);

        // Set up intersection observer for active heading
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-80px 0px -80% 0px' }
        );

        // Observe all headings after a short delay to let them render
        setTimeout(() => {
            extractedHeadings.forEach(({ id }) => {
                const element = document.getElementById(id);
                if (element) observer.observe(element);
            });
        }, 500);

        return () => observer.disconnect();
    }, [content]);

    const [isCollapsed, setIsCollapsed] = useState(false);

    // Auto-collapse on small screens
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsCollapsed(true);
            } else {
                setIsCollapsed(false);
            }
        };

        // Set initial state
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (headings.length < 3) return null; // Don't show TOC for short articles

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 border border-cyan-500/20 rounded-xl overflow-hidden mb-8 sticky top-20"
        >
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="w-full flex items-center justify-between p-6 bg-gray-800/50 hover:bg-gray-800 transition-colors"
            >
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    Table of Contents
                </h2>
                <div className={`transform transition-transform duration-300 ${isCollapsed ? '-rotate-90' : 'rotate-0'}`}>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>

            <AnimatePresence>
                {!isCollapsed && (
                    <motion.nav
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 pb-6 space-y-2 border-t border-gray-800/50 pt-2"
                    >
                        {headings.map((heading, index) => (
                            <a
                                key={index}
                                href={`#${heading.id}`}
                                className={`block transition-all duration-200 ${heading.level === 3 ? 'ml-4 text-sm' : 'text-base'
                                    } ${activeId === heading.id
                                        ? 'text-cyan-400 font-semibold pl-2 border-l-2 border-cyan-400'
                                        : 'text-gray-400 hover:text-cyan-300'
                                    }`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById(heading.id)?.scrollIntoView({
                                        behavior: 'smooth',
                                        block: 'start',
                                    });
                                    // On mobile, auto-collapse after clicking
                                    if (window.innerWidth < 768) {
                                        setIsCollapsed(true);
                                    }
                                }}
                            >
                                {heading.text}
                            </a>
                        ))}
                    </motion.nav>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default TableOfContents;
