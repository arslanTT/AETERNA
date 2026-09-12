"use client";

export default function SceneBackdrop() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          "radial-gradient(ellipse 60% 50% at 50% 45%, rgba(201, 168, 76, 0.08) 0%, rgba(201, 168, 76, 0.03) 30%, rgba(10, 10, 10, 0) 70%)",
      }}
    />
  );
}
