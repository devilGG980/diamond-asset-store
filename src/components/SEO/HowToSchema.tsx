import React, { useEffect } from 'react';

interface FAQItem {
    question: string;
    answer: string;
}

interface HowToSchemaProps {
    name: string;
    description: string;
    image?: string;
    estimatedCost?: string;
    totalTime?: string;
    steps: Array<{
        name: string;
        text: string;
        image?: string;
        url?: string;
    }>;
}

const HowToSchema: React.FC<HowToSchemaProps> = ({
    name,
    description,
    image,
    estimatedCost,
    totalTime,
    steps
}) => {
    useEffect(() => {
        const schemaData = {
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": name,
            "description": description,
            ...(image && { "image": image }),
            ...(estimatedCost && { "estimatedCost": { "@type": "MonetaryAmount", "currency": "USD", "value": estimatedCost } }),
            ...(totalTime && { "totalTime": totalTime }),
            "step": steps.map((step, index) => ({
                "@type": "HowToStep",
                "position": index + 1,
                "name": step.name,
                "text": step.text,
                ...(step.image && { "image": step.image }),
                ...(step.url && { "url": step.url })
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
    }, [name, description, image, estimatedCost, totalTime, steps]);

    return null;
};

export default HowToSchema;
