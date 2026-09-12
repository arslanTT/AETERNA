"use client";

import { useEffect } from "react";
import { useLoadingStore } from "@/lib/loading-store";

const MODEL_URL = "/models/watch.glb";

export default function ModelLoader() {
  const setProgress = useLoadingStore((s) => s.setProgress);
  const setReady = useLoadingStore((s) => s.setReady);

  useEffect(() => {
    let cancelled = false;

    const loadWithProgress = async () => {
      try {
        const response = await fetch(MODEL_URL);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const contentLength = response.headers.get("Content-Length");
        const total = contentLength ? parseInt(contentLength, 10) : 0;

        // If the browser has no Content-Length or we're reading from cache
        // with no size info, fall back to a smooth synthetic progress.
        if (!total || !response.body) {
          // No body stream → just wait and mark ready
          await response.arrayBuffer();
          if (cancelled) return;
          // Animate progress from current to 1
          animateTo100(setProgress);
          setTimeout(() => {
            if (!cancelled) setReady();
          }, 400);
          return;
        }

        const reader = response.body.getReader();
        let received = 0;
        const chunks: Uint8Array[] = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (cancelled) return;
          chunks.push(value);
          received += value.length;

          const ratio = Math.min(received / total, 1);
          // Cap at 0.9 so the visual bar doesn't hit 100% until actual decode
          setProgress(ratio * 0.9);
        }

        // Now buffer the full result so it's in the HTTP cache
        const blob = new Blob(chunks as BlobPart[]);
        // Touch the URL to warm the cache (fetch again should hit browser cache)
        void blob;

        // Signal that bytes are downloaded; kick off useGLTF preload
        // (it will hit the cache since we just downloaded it)
        setProgress(0.95);

        const { useGLTF } = await import("@react-three/drei");
        useGLTF.preload(MODEL_URL);

        // Wait a beat, then mark ready
        setTimeout(() => {
          if (!cancelled) setReady();
        }, 300);
      } catch (err) {
        console.error("Model load failed:", err);
        if (!cancelled) {
          setProgress(1);
          setReady();
        }
      }
    };

    loadWithProgress();

    return () => {
      cancelled = true;
    };
  }, [setProgress, setReady]);

  return null;
}

/**
 * Synthetic progress filler: animates from current value to 1 over ~600ms.
 * Used when we can't read byte-level progress (e.g., cache hits).
 */
function animateTo100(setProgress: (v: number) => void) {
  const start = performance.now();
  const duration = 600;
  const startValue = useLoadingStore.getState().progress;

  const tick = (now: number) => {
    const t = Math.min((now - start) / duration, 1);
    const eased = t * t * (3 - 2 * t); // smoothstep
    setProgress(startValue + (1 - startValue) * eased);
    if (t < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}
