// Simple AI image generation service
// Default provider: Pollinations (no key). You can swap to SUBNP by changing the base URL.

export interface GenerateOptions {
  width?: number;
  height?: number;
  seed?: number;
  provider?: 'pollinations' | 'subnp';
}

const PROVIDERS = {
  pollinations: (prompt: string, o: GenerateOptions) => {
    const width = o.width || 1280;
    const height = o.height || 720;
    const seed = o.seed ?? Math.floor(Math.random() * 1000000);
    // Pollinations serves the image directly by URL
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&seed=${seed}&nologo=true`;
    return url;
  },
  subnp: (prompt: string, o: GenerateOptions) => {
    // Placeholder for SUBNP. If you have a different endpoint, update here.
    const width = o.width || 1280;
    const height = o.height || 720;
    const seed = o.seed ?? Math.floor(Math.random() * 1000000);
    const base = (window as any).SUBNP_BASE_URL || 'https://image.pollinations.ai/prompt';
    return `${base}/${encodeURIComponent(prompt)}?width=${width}&height=${height}&seed=${seed}`;
  }
};

export function generateImageUrl(prompt: string, options: GenerateOptions = {}): string {
  const provider = options.provider || 'subnp';
  return PROVIDERS[provider](prompt, options);
}