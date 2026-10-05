"use client";

import React, {
  useEffect,
  useRef,
  useMemo,
  type ReactNode,
  type RefObject,
  type ElementType,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ScrollRevealProps {
  children: ReactNode;
  as?: ElementType;
  scrollContainerRef?: RefObject<HTMLElement | null>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  className?: string;
  rotationEnd?: string;
  wordAnimationEnd?: string;
}

/**
 * React Bits ScrollReveal text animation.
 * Gently unblurs words and reveals them on scroll while preserving original typography.
 */
export default function ScrollReveal({
  children,
  as = "p",
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.15,
  baseRotation = 0,
  blurStrength = 4,
  className,
  rotationEnd = "bottom bottom",
  wordAnimationEnd = "bottom 70%",
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();

  const splitText = useMemo(() => {
    if (typeof children !== "string") return children;
    return children.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      return (
        <span className="inline-block word will-change-[opacity,filter,transform]" key={index}>
          {word}
        </span>
      );
    });
  }, [children]);

  useEffect(() => {
    if (reduceMotion || typeof window === "undefined") return;
    const el = containerRef.current;
    if (!el) return;

    const scroller = scrollContainerRef?.current ?? window;

    const ctx = gsap.context(() => {
      if (baseRotation !== 0) {
        gsap.fromTo(
          el,
          { transformOrigin: "0% 50%", rotate: baseRotation },
          {
            ease: "none",
            rotate: 0,
            scrollTrigger: {
              trigger: el,
              scroller,
              start: "top 95%",
              end: rotationEnd,
              scrub: true,
            },
          },
        );
      }

      const wordElements = el.querySelectorAll<HTMLElement>(".word");
      if (wordElements.length === 0) return;

      gsap.fromTo(
        wordElements,
        { opacity: baseOpacity },
        {
          ease: "none",
          opacity: 1,
          stagger: 0.05,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: "top 90%",
            end: wordAnimationEnd,
            scrub: true,
          },
        },
      );

      if (enableBlur) {
        gsap.fromTo(
          wordElements,
          { filter: `blur(${blurStrength}px)` },
          {
            ease: "none",
            filter: "blur(0px)",
            stagger: 0.05,
            scrollTrigger: {
              trigger: el,
              scroller,
              start: "top 90%",
              end: wordAnimationEnd,
              scrub: true,
            },
          },
        );
      }
    }, el);

    return () => {
      ctx.revert();
    };
  }, [
    scrollContainerRef,
    enableBlur,
    baseRotation,
    baseOpacity,
    rotationEnd,
    wordAnimationEnd,
    blurStrength,
    reduceMotion,
  ]);

  const Tag = as || "p";

  return React.createElement(
    Tag,
    {
      ref: containerRef,
      className: cn("text-pretty", className),
    },
    splitText,
  );
}
