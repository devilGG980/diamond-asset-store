import React, { useEffect } from 'react';

interface OrganizationSchemaProps {
    name?: string;
    url?: string;
    logo?: string;
    description?: string;
    sameAs?: string[];
    contactPoint?: {
        telephone?: string;
        contactType?: string;
        email?: string;
    };
}

const OrganizationSchema: React.FC<OrganizationSchemaProps> = ({
    name = "EditorVault",
    url = "https://editorvault.web.app",
    logo = "https://editorvault.web.app/logo512.png",
    description = "Free video editing assets, templates, and thumbnail maker for content creators. Download 500+ professional transitions, effects, and resources for Premiere Pro, After Effects, and more.",
    sameAs = [],
    contactPoint
}) => {
    useEffect(() => {
        const schemaMarkup: any = {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": name,
            "url": url,
            "logo": {
                "@type": "ImageObject",
                "url": logo
            },
            "description": description,
            "sameAs": sameAs
        };

        if (contactPoint) {
            schemaMarkup.contactPoint = {
                "@type": "ContactPoint",
                ...contactPoint
            };
        }

        // Create or update organization schema script tag
        let orgSchema = document.querySelector('script[data-schema="organization"]');
        if (!orgSchema) {
            orgSchema = document.createElement('script');
            orgSchema.setAttribute('type', 'application/ld+json');
            orgSchema.setAttribute('data-schema', 'organization');
            document.head.appendChild(orgSchema);
        }
        orgSchema.textContent = JSON.stringify(schemaMarkup, null, 2);

        return () => {
            // Cleanup on unmount
            const schemaElement = document.querySelector('script[data-schema="organization"]');
            if (schemaElement) {
                schemaElement.remove();
            }
        };
    }, [name, url, logo, description, sameAs, contactPoint]);

    return null;
};

export default OrganizationSchema;
