"use client";

import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState, useRef, useId, useEffect } from "react";

export interface CarouselSlide {
  icon: LucideIcon;
  kicker?: string;
  title: string;
  body: string;
}

interface SlideProps {
  slide: CarouselSlide;
  index: number;
  current: number;
  handleSlideClick: (index: number) => void;
}

const Slide = ({ slide, index, current, handleSlideClick }: SlideProps) => {
  const slideRef = useRef<HTMLLIElement>(null);

  const xRef = useRef(0);
  const yRef = useRef(0);
  const frameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const animate = () => {
      if (!slideRef.current) return;

      const x = xRef.current;
      const y = yRef.current;

      slideRef.current.style.setProperty("--x", `${x}px`);
      slideRef.current.style.setProperty("--y", `${y}px`);

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const handleMouseMove = (event: React.MouseEvent) => {
    const el = slideRef.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    xRef.current = event.clientX - (r.left + Math.floor(r.width / 2));
    yRef.current = event.clientY - (r.top + Math.floor(r.height / 2));
  };

  const handleMouseLeave = () => {
    xRef.current = 0;
    yRef.current = 0;
  };

  const { icon: Icon, kicker, title, body } = slide;
  const active = current === index;

  return (
    <div className="[perspective:1200px] [transform-style:preserve-3d]">
      <li
        ref={slideRef}
        className="relative z-10 mx-[3vmin] flex h-[62vmin] max-h-[420px] w-[80vmin] max-w-[540px] flex-1 flex-col items-start justify-center text-left opacity-100 transition-all duration-300 ease-in-out"
        onClick={() => handleSlideClick(index)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: !active
            ? "scale(0.94) rotateX(8deg)"
            : "scale(1) rotateX(0deg)",
          transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          transformOrigin: "bottom",
        }}
      >
        {/* card surface — parallax follows cursor when active */}
        <div
          className="absolute inset-0 overflow-hidden rounded-2xl border border-hairline bg-elevated transition-all duration-150 ease-out"
          style={{
            transform: active
              ? "translate3d(calc(var(--x) / 40), calc(var(--y) / 40), 0)"
              : "none",
          }}
        >
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/[0.06] blur-3xl transition-opacity duration-700"
            style={{ opacity: active ? 1 : 0 }}
          />
          {!active && (
            <div className="absolute inset-0 bg-black/40 transition-all duration-700" />
          )}
        </div>

        <article
          className={`relative w-full px-8 py-9 transition-opacity duration-700 ease-in-out sm:px-10 ${
            active ? "visible opacity-100" : "invisible opacity-0"
          }`}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-hairline bg-base text-accent">
            <Icon size={26} strokeWidth={1.75} />
          </div>
          {kicker && (
            <span className="mt-6 block font-mono text-[11px] uppercase tracking-[0.2em] text-fg-subtle">
              {kicker}
            </span>
          )}
          <h3 className="mt-3 font-heading text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
            {title}
          </h3>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-fg-muted">
            {body}
          </p>
        </article>
      </li>
    </div>
  );
};

interface CarouselControlProps {
  type: "previous" | "next";
  title: string;
  handleClick: () => void;
}

const CarouselControl = ({ type, title, handleClick }: CarouselControlProps) => {
  return (
    <button
      type="button"
      className={`mx-2 flex h-11 w-11 items-center justify-center rounded-full border border-hairline-strong bg-elevated text-fg-muted transition duration-200 hover:-translate-y-0.5 hover:border-accent hover:text-fg focus:border-accent focus:outline-none active:translate-y-0.5 ${
        type === "previous" ? "rotate-180" : ""
      }`}
      title={title}
      aria-label={title}
      onClick={handleClick}
    >
      <ArrowRight size={18} />
    </button>
  );
};

interface CarouselProps {
  slides: CarouselSlide[];
}

export function Carousel({ slides }: CarouselProps) {
  const [current, setCurrent] = useState(0);

  const handlePreviousClick = () => {
    const previous = current - 1;
    setCurrent(previous < 0 ? slides.length - 1 : previous);
  };

  const handleNextClick = () => {
    const next = current + 1;
    setCurrent(next === slides.length ? 0 : next);
  };

  const handleSlideClick = (index: number) => {
    if (current !== index) {
      setCurrent(index);
    }
  };

  const id = useId();

  return (
    <div
      className="relative mx-auto h-[62vmin] max-h-[420px] w-[80vmin] max-w-[540px]"
      aria-labelledby={`carousel-heading-${id}`}
    >
      <ul
        className="absolute mx-[-3vmin] flex transition-transform duration-1000 ease-in-out"
        style={{
          transform: `translateX(-${current * (100 / slides.length)}%)`,
        }}
      >
        {slides.map((slide, index) => (
          <Slide
            key={index}
            slide={slide}
            index={index}
            current={current}
            handleSlideClick={handleSlideClick}
          />
        ))}
      </ul>

      <div className="absolute top-[calc(100%+1.25rem)] flex w-full items-center justify-center">
        <CarouselControl
          type="previous"
          title="Go to previous slide"
          handleClick={handlePreviousClick}
        />

        {/* dot indicators */}
        <div className="mx-2 flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => setCurrent(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                current === index
                  ? "w-6 bg-white"
                  : "w-1.5 bg-surface-subtle hover:bg-fg-subtle"
              }`}
            />
          ))}
        </div>

        <CarouselControl
          type="next"
          title="Go to next slide"
          handleClick={handleNextClick}
        />
      </div>
    </div>
  );
}
