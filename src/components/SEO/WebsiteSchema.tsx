import React, { useEffect } from 'react';

interface WebsiteSchemaProps {
    name?: string;
    url?: string;
    description?: string;
    enableSearchBox?: boolean;
}

const WebsiteSchema: React.FC<WebsiteSchemaProps> = ({
    name = "EditorVault",
    url = "https://editorvault.web.app",
    description = "Download 500+ free video editing assets including transitions, templates, and backgrounds. Create stunning YouTube thumbnails with our free thumbnail maker.",
    enableSearchBox = true
}) => {
    useEffect(() => {
        const schemaMarkup: any = {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": name,
            "url": url,
            "description": description
        };

        // Add potential action for site search
        if (enableSearchBox) {
            schemaMarkup.potentialAction = {
                "@type": "SearchAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": `${url}/store?search={search_term_string}`
                },
                "query-input": "required name=search_term_string"
            };
        }

        // Create or update website schema script tag
        let websiteSchema = document.querySelector('script[data-schema="website"]');
        if (!websiteSchema) {
            websiteSchema = document.createElement('script');
            websiteSchema.setAttribute('type', 'application/ld+json');
            websiteSchema.setAttribute('data-schema', 'website');
            document.head.appendChild(websiteSchema);
        }
        websiteSchema.textContent = JSON.stringify(schemaMarkup, null, 2);

        return () => {
            // Cleanup on unmount
            const schemaElement = document.querySelector('script[data-schema="website"]');
            if (schemaElement) {
                schemaElement.remove();
            }
        };
    }, [name, url, description, enableSearchBox]);

    return null;
};

export default WebsiteSchema;
