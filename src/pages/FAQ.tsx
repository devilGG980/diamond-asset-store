import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronDownIcon,
    SparklesIcon,
    QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';
import PageSEO from '../components/SEO/PageSEO';
import FAQSchema from '../components/SEO/FAQSchema';

interface FAQItem {
    question: string;
    answer: string;
    category: string;
}

const FAQ: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [activeCategory, setActiveCategory] = useState<string>('All');

    const faqs: FAQItem[] = [
        // Video Assets Questions
        {
            question: 'What types of video editing assets are available?',
            answer: 'We offer a comprehensive library of 500+ professional video editing assets including transitions, templates, overlays, motion graphics, backgrounds, effects, stickers, and text animations. All assets are compatible with Premiere Pro, After Effects, DaVinci Resolve, Final Cut Pro, and other popular video editing software.',
            category: 'Assets'
        },
        {
            question: 'Are the video editing assets really free?',
            answer: 'Yes! All our video editing assets are completely free to download with no hidden costs, subscriptions, or watermarks. We provide instant access to premium-quality resources for creators of all levels. Our mission is to empower content creators with professional tools without financial barriers.',
            category: 'Assets'
        },
        {
            question: 'Can I use these assets for commercial projects?',
            answer: 'Absolutely! Our video editing assets come with a commercial-use license, meaning you can use them in client projects, YouTube videos for monetization, commercial advertisements, and any revenue-generating content. The only restriction is that you cannot resell or redistribute the raw assets themselves.',
            category: 'Licensing'
        },
        {
            question: 'What video editing software are these assets compatible with?',
            answer: 'Our assets are designed to work with all major video editing platforms including Adobe Premiere Pro, After Effects, DaVinci Resolve, Final Cut Pro, Sony Vegas Pro, Filmora, and CapCut. Most assets are provided in universal formats like MP4, MOV, PNG sequences, and project files that ensure maximum compatibility.',
            category: 'Technical'
        },
        {
            question: 'How do I download video editing assets?',
            answer: 'Downloading is simple and instant! Browse our asset library, click on any asset you like, and hit the download button. No account creation or signup required. Assets download directly to your device and are ready to use immediately in your video editing project.',
            category: 'Assets'
        },

        // Thumbnail Maker Questions
        {
            question: 'Is the thumbnail maker really free with no watermark?',
            answer: 'Yes! Our thumbnail maker is 100% free with zero watermarks. Create unlimited professional YouTube thumbnails without any branding, logos, or limitations. Download your designs in high-resolution PNG or JPG format, perfect for YouTube, Instagram, TikTok, and all social media platforms.',
            category: 'Thumbnail Maker'
        },
        {
            question: 'Do I need to sign up to use the thumbnail maker?',
            answer: 'No signup required! Start creating stunning thumbnails instantly without creating an account. Simply visit the thumbnail editor, design your masterpiece, and download it immediately. Your privacy is important to us, so we do not require any personal information.',
            category: 'Thumbnail Maker'
        },
        {
            question: 'What features does the thumbnail maker include?',
            answer: 'Our thumbnail maker is packed with professional features: custom text with multiple fonts, drag-and-drop functionality, backgrounds library, stickers and shapes, color picker, image upload, filters and effects, alignment tools, layers panel, and AI-powered suggestions. Everything you need to create eye-catching thumbnails that boost your click-through rate.',
            category: 'Thumbnail Maker'
        },
        {
            question: 'What size should my YouTube thumbnail be?',
            answer: 'YouTube recommends 1280x720 pixels (16:9 aspect ratio) with a minimum width of 640 pixels. Our thumbnail maker automatically creates thumbnails in the optimal 1280x720 resolution, ensuring your thumbnails look perfect on all devices including desktop, mobile, and TV screens.',
            category: 'Thumbnail Maker'
        },
        {
            question: 'Can I upload my own images to the thumbnail maker?',
            answer: 'Yes! You can upload your own photos, screenshots, or graphics to create custom thumbnails. Supported formats include JPG, PNG, and WEBP. Combine your images with our text tools, backgrounds, and effects to create unique, attention-grabbing thumbnails that reflect your brand.',
            category: 'Thumbnail Maker'
        },

        // Usage & Technical
        {
            question: 'How often are new assets added?',
            answer: 'We add fresh video editing assets weekly! Our team continuously creates new transitions, templates, and effects based on current trends and user requests. Follow us on social media or check back regularly to discover the latest additions to our ever-growing library.',
            category: 'Assets'
        },
        {
            question: 'Can I request specific assets or features?',
            answer: 'Absolutely! We love hearing from our community. If you need specific transitions, effects, or thumbnail maker features, contact us through our contact page or social media. We prioritize user requests and frequently add community-suggested content to our platform.',
            category: 'Support'
        },
        {
            question: 'Are there file size limits for downloads?',
            answer: 'No file size limits! Download as many assets as you need. Some premium effects and 4K templates may be larger files (100-500MB), but there are no restrictions on how much you can download. We recommend a stable internet connection for larger files.',
            category: 'Technical'
        },
        {
            question: 'Do you offer video editing tutorials?',
            answer: 'Yes! Check our blog section for comprehensive tutorials, tips, and guides on video editing, YouTube growth strategies, thumbnail design best practices, and how to use our assets effectively. We publish new educational content regularly to help you improve your video creation skills.',
            category: 'Support'
        },
        {
            question: 'What makes EditorVault different from other asset sites?',
            answer: 'EditorVault stands out with: 100% free assets (no hidden fees), no watermarks, no mandatory signups, commercial-use licensing, weekly updates, built-in thumbnail maker, diverse asset categories, and mobile-friendly design. Plus, we are built by creators, for creators, focusing on quality over quantity.',
            category: 'General'
        },
        {
            question: 'Can I use these assets on YouTube, TikTok, and Instagram?',
            answer: 'Yes! Our assets are perfect for all social media platforms including YouTube, TikTok, Instagram Reels, Facebook, Twitter, and more. They are optimized for various aspect ratios (16:9, 9:16, 1:1) ensuring your content looks professional on any platform.',
            category: 'Usage'
        },
        {
            question: 'Are the assets suitable for beginners?',
            answer: 'Definitely! Our assets are designed to be beginner-friendly while maintaining professional quality. Most assets work as simple drag-and-drop elements requiring no advanced editing skills. We also provide usage instructions and tutorials to help beginners get started quickly.',
            category: 'General'
        },
        {
            question: 'How do I install transitions and effects in my video editor?',
            answer: 'Installation varies by software: For Premiere Pro, import the file to your project panel and drag to timeline. For After Effects, open the project file or import compositions. For DaVinci Resolve, add to Media Pool. Each asset includes a README file with specific installation instructions for major editing platforms.',
            category: 'Technical'
        },
        {
            question: 'Do I need to credit EditorVault when using assets?',
            answer: 'Attribution is appreciated but not required! While we love seeing creators mention EditorVault, you are free to use our assets without crediting us. However, if you want to support us and help other creators discover free resources, a small mention is always welcome.',
            category: 'Licensing'
        },
        {
            question: 'Can I modify the downloaded assets?',
            answer: 'Yes, absolutely! Customize, edit, recolor, resize, and modify any asset to fit your project needs. The assets are provided as flexible resources for your creative freedom. You can adjust colors, timing, speed, effects, and combine multiple assets to create unique compositions.',
            category: 'Usage'
        },
    ];

    const categories = ['All', 'Assets', 'Thumbnail Maker', 'Licensing', 'Technical', 'Support', 'General', 'Usage'];

    const filteredFAQs = activeCategory === 'All'
        ? faqs
        : faqs.filter(faq => faq.category === activeCategory);

    const toggleAccordion = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <>
            <PageSEO
                title="FAQ - Frequently Asked Questions | EditorVault"
                description="Get answers to all your questions about free video editing assets, thumbnail maker, licensing, and more. Learn how to download and use our professional resources for YouTube, TikTok, and other platforms."
                keywords={[
                    'video editing assets faq',
                    'thumbnail maker help',
                    'free video assets questions',
                    'youtube thumbnail faq',
                    'video editing help',
                    'editorvault faq'
                ]}
            />

            <FAQSchema faqs={filteredFAQs.map(faq => ({
                question: faq.question,
                answer: faq.answer
            }))} />

            <div className="min-h-screen bg-black text-white pt-24 pb-16 px-4 relative overflow-hidden">
                {/* Animated background gradients */}
                <div className="pointer-events-none absolute inset-0">
                    <motion.div
                        className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-cyan-500/20 blur-3xl"
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>

                <div className="max-w-5xl mx-auto relative z-10">
                    {/* Header Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        {/* Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-white/10 mb-6"
                        >
                            <QuestionMarkCircleIcon className="w-10 h-10 text-cyan-400" />
                        </motion.div>

                        {/* Title */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4">
                            <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                                Frequently Asked Questions
                            </span>
                        </h1>

                        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            Everything you need to know about our free video editing assets, thumbnail maker, and services. Can't find your answer? <a href="/contact" className="text-cyan-400 hover:text-cyan-300 underline">Contact us</a>.
                        </p>
                    </motion.div>

                    {/* Category Filter */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-8 overflow-x-auto pb-2"
                    >
                        <div className="flex gap-3 justify-center flex-wrap">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 whitespace-nowrap ${activeCategory === category
                                        ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-500/25 scale-105'
                                        : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* FAQ Accordion */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-4"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredFAQs.map((faq, index) => (
                                <motion.div
                                    key={faq.question}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group"
                                >
                                    <div className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-sm overflow-hidden hover:border-white/20 transition-all duration-300">
                                        {/* Glow effect on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-cyan-500/0 to-purple-500/0 group-hover:from-purple-500/10 group-hover:via-cyan-500/10 group-hover:to-purple-500/10 transition-all duration-500" />

                                        {/* Question Button */}
                                        <button
                                            onClick={() => toggleAccordion(index)}
                                            className="relative w-full px-6 py-5 flex items-center justify-between text-left transition-all duration-300"
                                        >
                                            <div className="flex items-start gap-4 flex-1">
                                                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/30 to-cyan-500/30 flex items-center justify-center mt-0.5">
                                                    <SparklesIcon className="w-4 h-4 text-cyan-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-200 transition-colors duration-300">
                                                        {faq.question}
                                                    </h3>
                                                    <span className="inline-block mt-2 px-3 py-1 rounded-full bg-white/5 text-xs text-gray-400 border border-white/10">
                                                        {faq.category}
                                                    </span>
                                                </div>
                                            </div>
                                            <motion.div
                                                animate={{ rotate: activeIndex === index ? 180 : 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="flex-shrink-0 ml-4"
                                            >
                                                <ChevronDownIcon className="w-6 h-6 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                                            </motion.div>
                                        </button>

                                        {/* Answer */}
                                        <AnimatePresence>
                                            {activeIndex === index && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="px-6 pb-6 pl-[72px]">
                                                        <motion.p
                                                            initial={{ y: -10 }}
                                                            animate={{ y: 0 }}
                                                            className="text-gray-300 leading-relaxed"
                                                        >
                                                            {faq.answer}
                                                        </motion.p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {/* Still have questions CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="mt-16 text-center"
                    >
                        <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 backdrop-blur-xl p-8">
                            <h3 className="text-2xl font-bold text-white mb-3">
                                Still have questions?
                            </h3>
                            <p className="text-gray-300 mb-6">
                                Can't find the answer you're looking for? Our support team is here to help!
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a
                                    href="/contact"
                                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl font-semibold text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105"
                                >
                                    Contact Support
                                </a>
                                <a
                                    href="/blog"
                                    className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl font-semibold text-white hover:bg-white/10 transition-all duration-300 hover:scale-105"
                                >
                                    Read Our Blog
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default FAQ;
