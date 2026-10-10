import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname } from "node:path";
const root = resolve(".");
createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    const file = resolve(
      root,
      "." +
        (path === "/"
          ? "/demo/index.html"
          : path.startsWith("/embed/")
            ? "/site" + (path.endsWith("/") ? path + "index.html" : path)
          : ["/builder.html", "/builder.js", "/builder.css", "/family-embed-builder.js", "/api.html", "/api.css"].includes(path)
            ? "/site" + path
          : ["/family.css", "/tobiishi.css", "/demo.js"].includes(path)
            ? "/demo" + path
            : path),
    );
    if (!file.startsWith(root + "/")) throw Error();
    res.setHeader(
      "Content-Type",
      { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml" }[extname(file)] ??
        "application/octet-stream",
    );
    res.end(await readFile(file));
  } catch {
    res.statusCode = 404;
    res.end("Not found");
  }
}).listen(Number(process.env.PORT ?? 6901), "127.0.0.1", () =>
  console.log("Tobiishi: http://127.0.0.1:" + String(process.env.PORT ?? 6901)),
);
