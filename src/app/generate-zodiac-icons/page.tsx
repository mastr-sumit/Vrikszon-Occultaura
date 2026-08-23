"use client";

import { useEffect, useState } from "react";

const SIGNS = [
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces",
];

export default function GenerateZodiacIcons() {
  const [status, setStatus] = useState("Initializing solid zodiac generator...");

  useEffect(() => {
    async function drawAndSaveAll() {
      const size = 512;
      const center = size / 2;

      for (let idx = 0; idx < SIGNS.length; idx++) {
        const id = SIGNS[idx];
        setStatus(`Drawing solid image for ${id} (${idx + 1}/12)...`);

        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) continue;

        // Rich solid dark navy gradient background
        const bgGrad = ctx.createRadialGradient(center, center, 40, center, center, 256);
        bgGrad.addColorStop(0, "#132144");
        bgGrad.addColorStop(0.7, "#0b1329");
        bgGrad.addColorStop(1, "#060a17");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, size, size);

        // Rich gold gradient for linework
        const goldGrad = ctx.createLinearGradient(0, 0, size, size);
        goldGrad.addColorStop(0, "#fef08a");
        goldGrad.addColorStop(0.35, "#eab308");
        goldGrad.addColorStop(0.7, "#ca8a04");
        goldGrad.addColorStop(1, "#fff8d6");

        ctx.strokeStyle = goldGrad;
        ctx.fillStyle = goldGrad;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        // Outer gold rim circle
        ctx.beginPath();
        ctx.arc(center, center, 236, 0, Math.PI * 2);
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(center, center, 222, 0, Math.PI * 2);
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 6]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Small 12-point tick marks around the rim
        for (let i = 0; i < 12; i++) {
          const a = (i / 12) * Math.PI * 2;
          const x1 = center + Math.cos(a) * 222;
          const y1 = center + Math.sin(a) * 222;
          const x2 = center + Math.cos(a) * 236;
          const y2 = center + Math.sin(a) * 236;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Faint background starry dots
        const dotCoords = [
          [-140, -120], [150, -130], [-160, 110], [140, 140],
          [-60, -180], [70, 170], [-180, -30], [170, 20]
        ];
        dotCoords.forEach(([dx, dy]) => {
          ctx.beginPath();
          ctx.arc(center + dx, center + dy, 2, 0, Math.PI * 2);
          ctx.fill();
        });

        // Draw illustrated sign artwork
        ctx.save();
        ctx.translate(center, center);

        if (id === "aries") {
          // Ram Head & Spiral Horns
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(0, 110);
          ctx.lineTo(0, -20);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(0, -20);
          ctx.bezierCurveTo(-50, -100, -140, -90, -120, -10);
          ctx.bezierCurveTo(-100, 60, -30, 20, -50, -30);
          ctx.lineWidth = 4.5;
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(0, -20);
          ctx.bezierCurveTo(50, -100, 140, -90, 120, -10);
          ctx.bezierCurveTo(100, 60, 30, 20, 50, -30);
          ctx.lineWidth = 4.5;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(0, -110, 5, 0, Math.PI * 2);
          ctx.fill();
        } else if (id === "taurus") {
          // Bull Head & Crescent Horns
          ctx.lineWidth = 4.5;
          ctx.beginPath();
          ctx.arc(0, 30, 75, 0, Math.PI * 2);
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(0, -45, 110, 0.25 * Math.PI, 0.75 * Math.PI);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(-100, -90);
          ctx.quadraticCurveTo(-110, 0, -75, 20);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(100, -90);
          ctx.quadraticCurveTo(110, 0, 75, 20);
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(0, 70, 6, 0, Math.PI * 2);
          ctx.fill();
        } else if (id === "gemini") {
          // Dual Pillar Twins
          ctx.lineWidth = 4.5;
          ctx.beginPath();
          ctx.moveTo(-110, -110);
          ctx.quadraticCurveTo(0, -70, 110, -110);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(-110, 110);
          ctx.quadraticCurveTo(0, 70, 110, 110);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(-45, -90);
          ctx.lineTo(-45, 90);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(45, -90);
          ctx.lineTo(45, 90);
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(0, 0, 14, 0, Math.PI * 2);
          ctx.stroke();
        } else if (id === "cancer") {
          // Crab Claws
          ctx.lineWidth = 4.5;
          ctx.beginPath();
          ctx.arc(-55, -40, 45, 0, Math.PI * 2);
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(55, 40, 45, 0, Math.PI * 2);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(-10, -40);
          ctx.quadraticCurveTo(90, -40, 90, 20);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(10, 40);
          ctx.quadraticCurveTo(-90, 40, -90, -20);
          ctx.stroke();
        } else if (id === "leo") {
          // Lion Mane
          ctx.lineWidth = 4.5;
          ctx.beginPath();
          ctx.arc(-70, 70, 35, 0, Math.PI * 2);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(-35, 70);
          ctx.bezierCurveTo(30, 20, 80, -40, 10, -100);
          ctx.bezierCurveTo(-60, -140, -110, -50, -40, -10);
          ctx.bezierCurveTo(40, 30, 120, -20, 100, 70);
          ctx.stroke();
        } else if (id === "virgo") {
          // Maiden M-loop
          ctx.lineWidth = 4.5;
          ctx.beginPath();
          ctx.moveTo(-110, -80);
          ctx.lineTo(-110, 60);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(-110, -20);
          ctx.quadraticCurveTo(-60, -90, -20, -20);
          ctx.lineTo(-20, 60);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(-20, -20);
          ctx.quadraticCurveTo(30, -90, 70, -20);
          ctx.lineTo(70, 90);
          ctx.quadraticCurveTo(70, 130, 30, 110);
          ctx.quadraticCurveTo(-10, 90, 110, 110);
          ctx.stroke();
        } else if (id === "libra") {
          // Scales Beam & Arc
          ctx.lineWidth = 4.5;
          ctx.beginPath();
          ctx.moveTo(-120, 80);
          ctx.lineTo(120, 80);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(-120, 20);
          ctx.lineTo(-60, 20);
          ctx.arc(0, 20, 60, Math.PI, 0);
          ctx.lineTo(120, 20);
          ctx.stroke();
        } else if (id === "scorpio") {
          // Scorpion Stinger
          ctx.lineWidth = 4.5;
          ctx.beginPath();
          ctx.moveTo(-110, -80);
          ctx.lineTo(-110, 60);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(-110, -20);
          ctx.quadraticCurveTo(-60, -90, -20, -20);
          ctx.lineTo(-20, 60);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(-20, -20);
          ctx.quadraticCurveTo(30, -90, 70, -20);
          ctx.lineTo(70, 70);
          ctx.lineTo(110, 110);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(110, 80);
          ctx.lineTo(110, 110);
          ctx.lineTo(80, 110);
          ctx.stroke();
        } else if (id === "sagittarius") {
          // Bow & Arrow
          ctx.lineWidth = 4.5;
          ctx.beginPath();
          ctx.moveTo(-100, 100);
          ctx.lineTo(100, -100);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(40, -100);
          ctx.lineTo(100, -100);
          ctx.lineTo(100, -40);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(-50, -50);
          ctx.lineTo(50, 50);
          ctx.stroke();
        } else if (id === "capricorn") {
          // Sea-Goat
          ctx.lineWidth = 4.5;
          ctx.beginPath();
          ctx.moveTo(-110, -90);
          ctx.lineTo(-40, 50);
          ctx.lineTo(30, -90);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(30, -90);
          ctx.bezierCurveTo(90, -30, 120, 40, 60, 90);
          ctx.bezierCurveTo(10, 130, -30, 70, 20, 30);
          ctx.stroke();
        } else if (id === "aquarius") {
          // Twin Waves
          ctx.lineWidth = 4.5;
          ctx.beginPath();
          ctx.moveTo(-110, -40);
          ctx.lineTo(-65, -80);
          ctx.lineTo(-20, -40);
          ctx.lineTo(25, -80);
          ctx.lineTo(70, -40);
          ctx.lineTo(110, -80);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(-110, 40);
          ctx.lineTo(-65, 0);
          ctx.lineTo(-20, 40);
          ctx.lineTo(25, 0);
          ctx.lineTo(70, 40);
          ctx.lineTo(110, 0);
          ctx.stroke();
        } else if (id === "pisces") {
          // Twin Fish
          ctx.lineWidth = 4.5;
          ctx.beginPath();
          ctx.moveTo(-120, 0);
          ctx.lineTo(120, 0);
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(-50, 0, 100, -0.6 * Math.PI, 0.6 * Math.PI);
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(50, 0, 100, 0.4 * Math.PI, 1.6 * Math.PI);
          ctx.stroke();
        }

        ctx.restore();

        // Export data URL and save solid image
        const dataUrl = canvas.toDataURL("image/png");
        const filename = `zodiac/${id}.png`;

        await fetch("/api/save-wheel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            base64: dataUrl,
            filename,
          }),
        });
      }

      setStatus("SUCCESS! Generated all 12 solid zodiac PNG images.");
    }

    drawAndSaveAll();
  }, []);

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif", background: "#0b1329", color: "#fff", minHeight: "100vh" }}>
      <h1>Generating 12 Solid Zodiac PNG Images...</h1>
      <p style={{ fontSize: 20, color: "#eab308" }}>{status}</p>
    </div>
  );
}
