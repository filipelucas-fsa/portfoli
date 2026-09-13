import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";

interface TextLine {
  text: string;
  y: number; // 0-1, fraction of canvas height (text baseline, vertically centered)
  size: number; // 0-1, fraction of canvas height
  color: string;
  weight?: number;
  letterSpaced?: boolean;
  align?: CanvasTextAlign;
  x?: number; // 0-1, fraction of canvas width (only used when align != center)
}

interface CanvasTextTextureOptions {
  width: number;
  height: number;
  lines: TextLine[];
}

/**
 * Renders one or more lines of text onto an offscreen 2D canvas and exposes
 * it as a live THREE.CanvasTexture. Used instead of drei's <Text> (troika-three-text),
 * which unconditionally fetches a unicode glyph-resolution index from a third-party
 * CDN even when a local font is supplied - an external dependency a production
 * badge shouldn't depend on to render.
 */
function draw(canvas: HTMLCanvasElement, { width, height, lines }: CanvasTextTextureOptions) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, width, height);
  ctx.textBaseline = "middle";

  for (const line of lines) {
    ctx.textAlign = line.align ?? "center";
    ctx.fillStyle = line.color;
    ctx.font = `${line.weight ?? 700} ${Math.round(height * line.size)}px Syne, sans-serif`;
    const label = line.letterSpaced ? line.text.split("").join("\u200a\u200a") : line.text;
    const x = line.align === "left" ? width * (line.x ?? 0) : width / 2;
    ctx.fillText(label, x, height * line.y);
  }
}

export function useCanvasTextTexture(options: CanvasTextTextureOptions) {
  const canvas = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = options.width;
    c.height = options.height;
    return c;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.width, options.height]);

  const texture = useMemo(() => {
    const t = new THREE.CanvasTexture(canvas);
    t.anisotropy = 4;
    return t;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas]);

  const [, forceRedraw] = useState(0);
  const linesKey = JSON.stringify(options.lines);

  useEffect(() => {
    draw(canvas, options);
    texture.needsUpdate = true;

    let cancelled = false;
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(() => {
        if (cancelled) return;
        draw(canvas, options);
        texture.needsUpdate = true;
        forceRedraw((n) => n + 1);
      });
    }
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas, texture, linesKey]);

  return texture;
}
