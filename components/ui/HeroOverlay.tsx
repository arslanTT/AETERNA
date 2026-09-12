"use client";

interface HeroOverlayProps {
  titleRef?: React.RefObject<HTMLHeadingElement | null>;
  subtitleRef?: React.RefObject<HTMLParagraphElement | null>;
  scrollIndicatorRef?: React.RefObject<HTMLDivElement | null>;
}

export default function HeroOverlay({
  titleRef,
  subtitleRef,
  scrollIndicatorRef,
}: HeroOverlayProps) {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-center">
      {/* Title */}
      <h1
        ref={titleRef}
        className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-text-primary tracking-[0.2em] opacity-0 select-none text-center px-4"
        style={{
          textShadow: "0 0 40px rgba(201, 168, 76, 0.3)",
        }}
      >
        AETERNA
      </h1>

      {/* Subtitle */}
      <p
        ref={subtitleRef}
        className="font-sans text-base sm:text-lg md:text-xl text-text-muted tracking-widest opacity-0 select-none mt-5 text-center px-4"
      >
        Luxury Timepiece
      </p>

      {/* Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 opacity-0 flex flex-col items-center gap-2"
      >
        <span className="font-sans text-sm text-text-muted tracking-wider select-none">
          Scroll to explore
        </span>
        <div className="w-px h-8 bg-linear-to-b from-accent-primary to-transparent animate-bounce" />
      </div>
    </div>
  );
}
