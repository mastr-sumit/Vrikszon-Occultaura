"use client";

import { useEffect, useState } from "react";

export default function GenerateSacredWheel() {
  const [status, setStatus] = useState("Generating sacred mandala wheel...");

  useEffect(() => {
    async function generate() {
      try {
        const size = 1024;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("No 2D context");

        const cx = size / 2;
        const cy = size / 2;

        ctx.clearRect(0, 0, size, size);

        // Gold gradient helper
        const goldGrad = ctx.createLinearGradient(0, 0, size, size);
        goldGrad.addColorStop(0, "#fef08a");
        goldGrad.addColorStop(0.3, "#eab308");
        goldGrad.addColorStop(0.6, "#ca8a04");
        goldGrad.addColorStop(1, "#fef9c3");

        ctx.strokeStyle = goldGrad;
        ctx.fillStyle = goldGrad;

        // 1. Concentric circles
        const radii = [485, 470, 445, 415, 360, 300, 230, 160, 95, 40];
        radii.forEach((r, idx) => {
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.lineWidth = idx === 0 || idx === 2 || idx === 4 ? 2.5 : 1.2;
          if (idx === 3) ctx.setLineDash([6, 6]);
          else ctx.setLineDash([]);
          ctx.stroke();
        });
        ctx.setLineDash([]);

        // 2. Outer 32 Spoke Ticks with Crystal Dot Accents
        const numSpokes = 32;
        for (let i = 0; i < numSpokes; i++) {
          const angle = (i / numSpokes) * Math.PI * 2;
          const x1 = cx + Math.cos(angle) * 470;
          const y1 = cy + Math.sin(angle) * 470;
          const x2 = cx + Math.cos(angle) * 495;
          const y2 = cy + Math.sin(angle) * 495;

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.lineWidth = i % 4 === 0 ? 2 : 1;
          ctx.stroke();

          // Small crystal dot at tip
          ctx.beginPath();
          ctx.arc(x2, y2, i % 4 === 0 ? 3.5 : 2, 0, Math.PI * 2);
          ctx.fill();
        }

        // 3. Outer 16 Lotus Petals (r 360 to 445)
        const outerPetals = 16;
        for (let i = 0; i < outerPetals; i++) {
          const a1 = (i / outerPetals) * Math.PI * 2;
          const aMid = ((i + 0.5) / outerPetals) * Math.PI * 2;
          const a2 = ((i + 1) / outerPetals) * Math.PI * 2;

          const p1x = cx + Math.cos(a1) * 360;
          const p1y = cy + Math.sin(a1) * 360;
          const tipX = cx + Math.cos(aMid) * 445;
          const tipY = cy + Math.sin(aMid) * 445;
          const p2x = cx + Math.cos(a2) * 360;
          const p2y = cy + Math.sin(a2) * 360;

          // Outer contour
          ctx.beginPath();
          ctx.moveTo(p1x, p1y);
          ctx.quadraticCurveTo(
            cx + Math.cos(a1) * 420,
            cy + Math.sin(a1) * 420,
            tipX,
            tipY
          );
          ctx.quadraticCurveTo(
            cx + Math.cos(a2) * 420,
            cy + Math.sin(a2) * 420,
            p2x,
            p2y
          );
          ctx.lineWidth = 1.8;
          ctx.stroke();

          // Inner petal vein
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(aMid) * 360, cy + Math.sin(aMid) * 360);
          ctx.lineTo(tipX, tipY);
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // 4. Interlocking Diamond Gemstone Facet Ring (r 300 to 360, 24 count)
        const numDiamonds = 24;
        for (let i = 0; i < numDiamonds; i++) {
          const angle = (i / numDiamonds) * Math.PI * 2;
          const nextAngle = ((i + 1) / numDiamonds) * Math.PI * 2;
          const midAngle = ((i + 0.5) / numDiamonds) * Math.PI * 2;

          const innerX = cx + Math.cos(midAngle) * 300;
          const innerY = cy + Math.sin(midAngle) * 300;
          const outerX = cx + Math.cos(midAngle) * 360;
          const outerY = cy + Math.sin(midAngle) * 360;
          const leftX = cx + Math.cos(angle) * 330;
          const leftY = cy + Math.sin(angle) * 330;
          const rightX = cx + Math.cos(nextAngle) * 330;
          const rightY = cy + Math.sin(nextAngle) * 330;

          ctx.beginPath();
          ctx.moveTo(innerX, innerY);
          ctx.lineTo(leftX, leftY);
          ctx.lineTo(outerX, outerY);
          ctx.lineTo(rightX, rightY);
          ctx.closePath();
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Gemstone node at diamond center
          ctx.beginPath();
          ctx.arc(cx + Math.cos(midAngle) * 330, cy + Math.sin(midAngle) * 330, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // 5. Mid 12 Lotus Petals (r 160 to 300)
        const midPetals = 12;
        for (let i = 0; i < midPetals; i++) {
          const a1 = (i / midPetals) * Math.PI * 2;
          const aMid = ((i + 0.5) / midPetals) * Math.PI * 2;
          const a2 = ((i + 1) / midPetals) * Math.PI * 2;

          const tipX = cx + Math.cos(aMid) * 300;
          const tipY = cy + Math.sin(aMid) * 300;

          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(a1) * 160, cy + Math.sin(a1) * 160);
          ctx.quadraticCurveTo(cx + Math.cos(a1) * 260, cy + Math.sin(a1) * 260, tipX, tipY);
          ctx.quadraticCurveTo(cx + Math.cos(a2) * 260, cy + Math.sin(a2) * 260, cx + Math.cos(a2) * 160, cy + Math.sin(a2) * 160);
          ctx.lineWidth = 1.8;
          ctx.stroke();

          // Inner teardrop accent
          ctx.beginPath();
          ctx.arc(cx + Math.cos(aMid) * 230, cy + Math.sin(aMid) * 230, 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // 6. Central 8-Point Sacred Star & Lotus Core (r 40 to 160)
        const starPoints = 8;
        for (let i = 0; i < starPoints; i++) {
          const a1 = (i / starPoints) * Math.PI * 2;
          const aMid = ((i + 0.5) / starPoints) * Math.PI * 2;

          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(a1) * 40, cy + Math.sin(a1) * 40);
          ctx.lineTo(cx + Math.cos(aMid) * 155, cy + Math.sin(aMid) * 155);
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(cx + Math.cos(aMid) * 155, cy + Math.sin(aMid) * 155, 3, 0, Math.PI * 2);
          ctx.fill();
        }

        // Radiant central glowing gold crystal core
        const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 40);
        coreGrad.addColorStop(0, "#ffffff");
        coreGrad.addColorStop(0.4, "#fef08a");
        coreGrad.addColorStop(0.8, "#d4af37");
        coreGrad.addColorStop(1, "transparent");

        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, 40, 0, Math.PI * 2);
        ctx.fill();

        // Convert to dataURL
        const dataUrl = canvas.toDataURL("image/png");

        setStatus("Saving public/images/products/sacred-collection-wheel.png...");
        const res = await fetch("/api/save-wheel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            base64: dataUrl,
            filename: "products/sacred-collection-wheel.png",
          }),
        });

        const json = await res.json();
        if (json.success) {
          setStatus("SUCCESS! Saved sacred-collection-wheel.png (" + json.bytesWritten + " bytes)");
        } else {
          setStatus("ERROR saving: " + JSON.stringify(json));
        }
      } catch (err) {
        setStatus("FAILED: " + (err instanceof Error ? err.message : String(err)));
      }
    }

    generate();
  }, []);

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif", background: "#0f172a", color: "#fff", minHeight: "100vh" }}>
      <h1>Generating Sacred Collection Wheel...</h1>
      <p style={{ fontSize: 20, color: "#eab308" }}>{status}</p>
    </div>
  );
}
