import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS helper for dev
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Simple health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// AI endpoint removed
app.get('/api/ai/image', async (req, res) => {
  try {
    const prompt = String(req.query.prompt || 'Epic YouTube thumbnail');
    const width = Number(req.query.width || 1280);
    const height = Number(req.query.height || 720);
    const seed = Number(req.query.seed || Math.floor(Math.random() * 1000000));

    const subnpBase = process.env.SUBNP_BASE_URL || 'https://t2i.mcproe.xyz';

    async function tryFetch(url: string) {
      const r = await fetch(url);
      if (!r.ok) return null;
      const ct = r.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        const j: any = await r.json();
        // Try common fields
        const b64 = j.image || j.data || j.result || '';
        if (typeof b64 === 'string' && (b64.startsWith('data:image') || /^[A-Za-z0-9+/=]+$/.test(b64))) {
          let buf: Buffer;
          if (b64.startsWith('data:image')) {
            const comma = b64.indexOf(',');
            buf = Buffer.from(b64.slice(comma + 1), 'base64');
          } else {
            buf = Buffer.from(b64, 'base64');
          }
          return { contentType: 'image/png', buffer: buf };
        }
        return null;
      }
      // image stream
      if (ct.startsWith('image/')) {
        const ab = await r.arrayBuffer();
        return { contentType: ct, buffer: Buffer.from(ab) };
      }
      return null;
    }

    // Attempt SUBNP-style endpoints
    const candidates = [
      `${subnpBase}/api/free/generate?prompt=${encodeURIComponent(prompt)}&width=${width}&height=${height}&seed=${seed}`,
      `${subnpBase}/api/free/txt2img?prompt=${encodeURIComponent(prompt)}&width=${width}&height=${height}&seed=${seed}`,
      `${subnpBase}/api/free/image?prompt=${encodeURIComponent(prompt)}&width=${width}&height=${height}&seed=${seed}`,
    ];

    let result: { contentType: string; buffer: Buffer } | null = null;
    for (const url of candidates) {
      try {
        result = await tryFetch(url);
        if (result) break;
      } catch {}
    }

    // Fallback to Pollinations if SUBNP endpoints fail
    if (!result) {
      const pollUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&seed=${seed}&nologo=true`;
      const r = await fetch(pollUrl);
      if (!r.ok) return res.status(502).json({ error: 'Upstream generation failed', status: r.status });
      const ab = await r.arrayBuffer();
      result = { contentType: r.headers.get('content-type') || 'image/jpeg', buffer: Buffer.from(ab) };
    }

    res.setHeader('Content-Type', result.contentType);
    res.setHeader('Cache-Control', 'no-store');
    res.send(result.buffer);
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'proxy_error' });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('build'));
  
  // Return the main index.html for any unknown routes (for React Router)
  app.get('*', (req, res) => {
    res.sendFile('build/index.html', { root: '.' });
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
