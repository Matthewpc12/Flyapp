import express from "express";
import { createServer as createViteServer } from "vite";
import torrentStream from "torrent-stream";

const activeEngines = new Map<string, TorrentStream.TorrentEngine>();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API routes FIRST
  app.get("/api/movies", async (req, res) => {
    try {
      const { page = 1, limit = 20, query_term = '' } = req.query;
      const url = new URL('https://yts.lt/api/v2/list_movies.json');
      url.searchParams.append('page', page.toString());
      url.searchParams.append('limit', limit.toString());
      if (query_term) {
        url.searchParams.append('query_term', query_term.toString());
      }
      
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching movies from YTS:", error);
      res.status(500).json({ status: 'error', status_message: 'Failed to fetch movies' });
    }
  });

  app.get("/api/stream/:hash", (req, res) => {
    const hash = req.params.hash;
    const title = req.query.title as string || 'Video';
    
    // Construct magnet link
    const trackers = [
      'udp://open.demonii.com:1337/announce',
      'udp://tracker.openbittorrent.com:80',
      'udp://tracker.coppersurfer.tk:6969',
      'udp://glotorrents.pw:6969/announce',
      'udp://tracker.opentrackr.org:1337/announce',
      'udp://torrent.gresille.org:80/announce',
      'udp://p4p.arenabg.com:1337',
      'udp://tracker.leechers-paradise.org:6969'
    ];
    
    const magnet = `magnet:?xt=urn:btih:${hash}&dn=${encodeURIComponent(title)}&${trackers.map(t => `tr=${encodeURIComponent(t)}`).join('&')}`;
    
    let engine = activeEngines.get(hash);
    
    if (!engine) {
      engine = torrentStream(magnet, {
        connections: 100,
        uploads: 10,
        path: '/tmp/torrent-stream',
        verify: true,
        dht: true,
        tracker: true
      });
      activeEngines.set(hash, engine);
      
      // Cleanup after 1 hour of inactivity (simplified)
      setTimeout(() => {
        if (activeEngines.has(hash)) {
          const e = activeEngines.get(hash);
          if (e) e.destroy(() => console.log(`Destroyed engine for ${hash}`));
          activeEngines.delete(hash);
        }
      }, 60 * 60 * 1000);
    }

    const handleStream = (engine: TorrentStream.TorrentEngine) => {
      // Find the largest file (assume it's the movie)
      const file = engine.files.reduce((a, b) => a.length > b.length ? a : b);
      
      const fileSize = file.length;
      const range = req.headers.range;

      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = (end - start) + 1;
        
        const stream = file.createReadStream({ start, end });
        
        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': 'video/mp4',
        });
        
        stream.pipe(res);
        
        res.on('close', () => {
          stream.destroy();
        });
      } else {
        res.writeHead(200, {
          'Content-Length': fileSize,
          'Content-Type': 'video/mp4',
        });
        
        const stream = file.createReadStream();
        stream.pipe(res);
        
        res.on('close', () => {
          stream.destroy();
        });
      }
    };

    if (engine.files && engine.files.length > 0) {
      handleStream(engine);
    } else {
      engine.on('ready', () => {
        if (!engine) return;
        handleStream(engine);
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
