"use client";

import { useEffect } from "react";

export default function LogoFixer() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = "/images/logo.png?v=" + Date.now();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      const width = canvas.width;
      const height = canvas.height;
      const visited = new Uint8Array(width * height);
      const queue: number[] = [];
      let modified = false;

      function checkAndPush(x: number, y: number) {
        if (x < 0 || x >= width || y < 0 || y >= height) return;
        const idx = y * width + x;
        if (visited[idx]) return;

        const pIdx = idx * 4;
        const r = data[pIdx];
        const g = data[pIdx + 1];
        const b = data[pIdx + 2];

        // Match white / light background pixels
        if (r > 200 && g > 200 && b > 200) {
          visited[idx] = 1;
          data[pIdx + 3] = 0; // Make transparent
          modified = true;
          queue.push(x, y);
        }
      }

      // Seed all border pixels
      for (let x = 0; x < width; x++) {
        checkAndPush(x, 0);
        checkAndPush(x, height - 1);
      }
      for (let y = 0; y < height; y++) {
        checkAndPush(0, y);
        checkAndPush(width - 1, y);
      }

      // BFS flood fill outer background
      let head = 0;
      while (head < queue.length) {
        const cx = queue[head++];
        const cy = queue[head++];

        checkAndPush(cx + 1, cy);
        checkAndPush(cx - 1, cy);
        checkAndPush(cx, cy + 1);
        checkAndPush(cx, cy - 1);
      }

      if (modified) {
        ctx.putImageData(imgData, 0, 0);
        const transparentDataUrl = canvas.toDataURL("image/png");

        fetch("/api/save-logo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dataUrl: transparentDataUrl }),
        }).then((res) => {
          if (res.ok) {
            console.log("Successfully flood-filled outer white background of logo.png to transparent PNG!");
          }
        });
      }
    };
  }, []);

  return null;
}
