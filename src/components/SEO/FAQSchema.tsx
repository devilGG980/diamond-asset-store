import React, { useEffect } from 'react';

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQSchemaProps {
    faqs: FAQItem[];
}

const FAQSchema: React.FC<FAQSchemaProps> = ({ faqs }) => {
    useEffect(() => {
        const schemaMarkup = {
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

        // Create or update FAQ schema script tag
        let faqSchema = document.querySelector('script[data-schema="faq"]');
        if (!faqSchema) {
            faqSchema = document.createElement('script');
            faqSchema.setAttribute('type', 'application/ld+json');
            faqSchema.setAttribute('data-schema', 'faq');
            document.head.appendChild(faqSchema);
        }
        faqSchema.textContent = JSON.stringify(schemaMarkup, null, 2);

        return () => {
            // Cleanup on unmount
            const schemaElement = document.querySelector('script[data-schema="faq"]');
            if (schemaElement) {
                schemaElement.remove();
            }
        };
    }, [faqs]);

    return null;
};

export default FAQSchema;
