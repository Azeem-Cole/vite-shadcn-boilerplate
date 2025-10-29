import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";

const isProd = process.env.NODE_ENV === "production";
const __dirname = path.resolve();

async function startServer() {
  const app = express();
  app.use(express.json());

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist/client")));
  }

  app.post("/api/uploadBookmarks", (req, res) => {
    const bookmarks = req.body;
    const filePath = path.resolve(__dirname, "bookmarks.json");
    fs.writeFileSync(filePath, JSON.stringify(bookmarks, null, 2));
    res.json({ success: true, message: "Bookmarks saved successfully." });
  });

  app.get("/api/bookmarks", (req, res) => {
    const filePath = path.resolve(__dirname, "bookmarks.json");
    if (fs.existsSync(filePath)) {
      const bookmarks = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      res.json({ success: true, bookmarks });
    } else {
      res.json({ success: false, message: "No bookmarks found." });
    }
  });

  app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
  });
}

startServer();
