import React, { useEffect, useRef } from 'react';

interface LeaderboardAdProps {
    className?: string;
    label?: string;
}

const LeaderboardAd: React.FC<LeaderboardAdProps> = ({
    className = '',
    label = 'Advertisement'
}) => {
    const adContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        console.log("LeaderboardAd mounted. Hostname:", window.location.hostname);
        if (adContainerRef.current) {
            // Cleanup previous content to handle Strict Mode double-invoke
            adContainerRef.current.innerHTML = '';

            // Check if running on localhost - Show Visual Placeholder
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.log("Detected localhost, rendering placeholder");
                const placeholder = document.createElement('div');
                placeholder.innerHTML = `
                    <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: space-between; background: linear-gradient(90deg, #ff00cc, #333399); color: white; padding: 0 20px; box-sizing: border-box; font-family: sans-serif;">
                        <span style="font-weight: bold; font-size: 18px;">🔥 BEST VPN 2024</span>
                        <div style="background: yellow; color: black; padding: 5px 15px; border-radius: 4px; font-weight: bold; cursor: pointer;">INSTALL NOW</div>
                    </div>
                `;
                placeholder.style.width = '100%';
                placeholder.style.height = '100%';
                adContainerRef.current.appendChild(placeholder);
                return;
            }

            console.log("Injecting real ad script");
            const confScript = document.createElement('script');
            confScript.type = 'text/javascript';
            confScript.innerHTML = `
                atOptions = {
                    'key' : 'f17fdbdff4817fc47c1f1199ca49cb54',
                    'format' : 'iframe',
                    'height' : 90,
                    'width' : 728,
                    'params' : {}
                };
            `;
            adContainerRef.current.appendChild(confScript);

            const invokeScript = document.createElement('script');
            invokeScript.type = 'text/javascript';
            invokeScript.src = 'https://www.highperformanceformat.com/f17fdbdff4817fc47c1f1199ca49cb54/invoke.js';
            adContainerRef.current.appendChild(invokeScript);
        }
    }, []);

    return (
        <div className={`flex flex-col items-center justify-center my-4 relative group overflow-x-auto ${className}`}>
            <div className="relative p-6 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 backdrop-blur-sm shadow-2xl">
                {/* Decorative elements */}
                <div className="absolute -top-px left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                <div className="absolute -bottom-px left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

                {label && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/80 backdrop-blur-md border border-white/10 rounded-full">
                        <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">
                            {label}
                        </span>
                    </div>
                )}

                <div
                    className="relative flex justify-center items-center rounded-xl overflow-hidden bg-black/40 shadow-inner"
                    style={{ width: '728px', height: '90px' }}
                    ref={adContainerRef}
                >
                    {/* Ad will be injected here */}
                </div>
            </div>
        </div>
    );
};

export default LeaderboardAd;
