import React, { useEffect, useRef } from 'react';

interface BannerAdProps {
    className?: string;
    adId?: string;
    label?: string;
}

const BannerAd: React.FC<BannerAdProps> = ({
    className = '',
    label = 'Advertisement'
}) => {
    const adContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (adContainerRef.current && adContainerRef.current.childElementCount === 0) {
            // Check if running on localhost - Show Visual Placeholder
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                const placeholder = document.createElement('div');
                placeholder.innerHTML = `
                    <div style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: linear-gradient(135deg, #00C6FF, #0072FF); color: white; text-align: center; font-family: sans-serif;">
                        <span style="font-weight: bold; font-size: 20px; marginBottom: 10px;">WIN IPHONE 16</span>
                        <div style="background: white; color: #0072FF; padding: 8px 20px; border-radius: 20px; font-weight: bold; margin-top: 10px; cursor: pointer;">CLICK HERE</div>
                    </div>
                `;
                placeholder.style.width = '100%';
                placeholder.style.height = '100%';
                adContainerRef.current.appendChild(placeholder);
                return;
            }

            const confScript = document.createElement('script');
            confScript.type = 'text/javascript';
            confScript.innerHTML = `
                atOptions = {
                    'key' : '052edb383275b120a5a3e5af90668118',
                    'format' : 'iframe',
                    'height' : 250,
                    'width' : 300,
                    'params' : {}
                };
            `;
            adContainerRef.current.appendChild(confScript);

            const invokeScript = document.createElement('script');
            invokeScript.type = 'text/javascript';
            invokeScript.src = 'https://www.highperformanceformat.com/052edb383275b120a5a3e5af90668118/invoke.js';
            adContainerRef.current.appendChild(invokeScript);
        }
    }, []);

    return (
        <div className={`flex flex-col items-center justify-center my-4 relative group ${className}`}>
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
                    style={{ width: '300px', height: '250px' }}
                    ref={adContainerRef}
                >
                    {/* Ad will be injected here */}
                </div>
            </div>
        </div>
    );
};

export default BannerAd;
