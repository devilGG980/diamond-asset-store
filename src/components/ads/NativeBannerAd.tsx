import React, { useEffect, useRef, useState } from 'react';

interface NativeBannerAdProps {
    className?: string;
    adId?: string;
    label?: string;
}

const NativeBannerAd: React.FC<NativeBannerAdProps> = ({
    className = '',
    adId = 'a7622dfd77dd5af77df33fe6f942bbdd',
    label = 'Advertisement'
}) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe || !adId) return;

        const doc = iframe.contentWindow?.document;
        if (!doc) return;

        // Reset iframe content
        doc.open();
        doc.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { margin: 0; display: flex; justify-content: center; align-items: center; background: transparent; overflow: hidden; }
                    #container-${adId} { width: 100%; display: flex; justify-content: center; }
                </style>
            </head>
            <body>
                <div id="container-${adId}"></div>
                <script>
                    // Add listener to resize iframe when ad loads
                    const observer = new ResizeObserver(entries => {
                         const height = entries[0].contentRect.height;
                         if(height > 10) {
                             window.parent.postMessage({ type: 'AD_RESIZE', height: height, adId: '${adId}' }, '*');
                         }
                    });
                    observer.observe(document.body);
                </script>
                <script type="text/javascript">
                    (function() {
                        var script = document.createElement('script');
                        script.async = true;
                        script.dataset.cfasync = "false";
                        script.src = "//pl25585501.profitablecpmgate.com/${adId}/invoke.js";
                        var container = document.getElementById("container-${adId}");
                        if(container) container.appendChild(script);
                    })();
                </script>
            </body>
            </html>
        `);
        doc.close();

        setIsLoaded(true);
    }, [adId]);

    // Handle iframe resize messages if needed, though simpler just to give it a fixed height or min-height
    // For native banners, they are usually responsive but might need height adjustment.

    return (
        <div className={`flex flex-col items-center justify-center my-8 ${className}`}>
            {label && <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">{label}</div>}
            <div className="w-full bg-gray-900/50 rounded-lg overflow-hidden relative flex justify-center min-h-[100px]">
                {!isLoaded && (
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                )}
                <iframe
                    ref={iframeRef}
                    title="Advertisement"
                    scrolling="no"
                    frameBorder="0"
                    width="100%"
                    height="120" // Default height, native ads usually fit
                    style={{ border: 'none', overflow: 'hidden' }}
                />
            </div>
        </div>
    );
};

export default NativeBannerAd;
