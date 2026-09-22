const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = false;
const hostname = "127.0.0.1";
const port = parseInt(process.env.PORT, 10) || 3000;
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const fs = require("fs");
const path = require("path");

const MIME_MAP = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
};

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      const { pathname } = parsedUrl;

      // Direct static serving for dynamic uploads in public/images and public/videos
      if (pathname && (pathname.startsWith("/images/") || pathname.startsWith("/videos/"))) {
        const cleanPath = pathname.replace(/\.\./g, "").replace(/^\/+/, "");
        const filePath = path.join(__dirname, "public", cleanPath);

        if (fs.existsSync(filePath)) {
          const stat = fs.statSync(filePath);
          if (stat.isFile()) {
            const ext = path.extname(filePath).toLowerCase();
            const contentType = MIME_MAP[ext] || "application/octet-stream";

            const range = req.headers.range;
            if (range) {
              const parts = range.replace(/bytes=/, "").split("-");
              const start = parseInt(parts[0], 10);
              const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;

              if (start < stat.size && end < stat.size) {
                res.writeHead(206, {
                  "Content-Range": `bytes ${start}-${end}/${stat.size}`,
                  "Accept-Ranges": "bytes",
                  "Content-Length": end - start + 1,
                  "Content-Type": contentType,
                  "Cache-Control": "public, max-age=31536000, immutable",
                });
                fs.createReadStream(filePath, { start, end }).pipe(res);
                return;
              }
            }

            res.writeHead(200, {
              "Content-Type": contentType,
              "Content-Length": stat.size,
              "Accept-Ranges": "bytes",
              "Cache-Control": "public, max-age=31536000, immutable",
            });
            fs.createReadStream(filePath).pipe(res);
            return;
          }
        }
      }

      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  })
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
