import express from "express";
import { createServer as createViteServer } from "vite";

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
