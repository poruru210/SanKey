"use client";

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine } from "@tsparticles/engine";

export function ParticlesBackground() {
  const [engineReady, setEngineReady] = useState(false);

  useEffect(() => {
    // アプリケーション起動時に一度だけエンジンをロード
    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine);
    }).then(() => {
      setEngineReady(true);
    });
  }, []);

  // エンジン準備ができるまで何も描画しない
  if (!engineReady) return null;

  return (
      <div className="fixed inset-0 -z-10">
        <Particles
            id="tsparticles"
            options={{
              fullScreen: { enable: false, zIndex: -1 },
              background: { color: { value: "transparent" } },
              fpsLimit: 60,
              particles: {
                color: { value: "#0a5d26" },
                links: { enable: true, distance: 150, color: "#0a5d26", opacity: 0.2, width: 1 },
                move: { enable: true, outModes: { default: "bounce" } },
                number: {  value: 50 },
                shape: { type: "circle" },
                size: { value: { min: 1, max: 3 } },
              },
              detectRetina: true,
            }}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              zIndex: -1,
            }}
        />
      </div>
  );
}
