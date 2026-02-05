import React, { useEffect } from 'react';

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQBlogSchemaProps {
    faqs: FAQItem[];
}

const FAQBlogSchema: React.FC<FAQBlogSchemaProps> = ({ faqs }) => {
    useEffect(() => {
        if (!faqs || faqs.length === 0) return;

        const schemaData = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer
                }
            }))
        };

        const script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        script.textContent = JSON.stringify(schemaData, null, 2);
        document.head.appendChild(script);

        return () => {
            if (script.parentNode) {
                script.remove();
            }
        };
    }, [faqs]);

    return null;
};

export default FAQBlogSchema;
