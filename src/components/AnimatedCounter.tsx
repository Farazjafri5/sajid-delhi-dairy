"use client";

import { useEffect, useState, useRef } from "react";

interface AnimatedCounterProps {
  value: string;
}

export default function AnimatedCounter({ value }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState("");
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    // Parse the metric
    const regex = /^(\+)?([0-9]+(?:\.[0-9]+)?)(%|M|K)?$/i;
    const match = value.match(regex);
    
    if (!match) {
      setDisplayValue(value);
      return;
    }

    const prefix = match[1] || "";
    const targetNum = parseFloat(match[2]);
    const suffix = match[3] || "";
    const isFloat = match[2].includes(".");

    // Set initial zero state
    const initialZero = isFloat ? "0.0" : "0";
    setDisplayValue(`${prefix}${initialZero}${suffix}`);

    // Trigger animation when the element is visible in the viewport
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animateCounter(prefix, targetNum, suffix, isFloat);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [value]);

  const animateCounter = (
    prefix: string,
    target: number,
    suffix: string,
    isFloat: boolean
  ) => {
    const duration = 1500; // Smooth 1.5 seconds animation duration
    const startTime = performance.now();

    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing easeOutQuad: slow down near the target value
      const easeProgress = progress * (2 - progress);
      const currentNum = easeProgress * target;

      let formattedNum = "";
      if (isFloat) {
        formattedNum = currentNum.toFixed(1);
      } else {
        formattedNum = Math.floor(currentNum).toString();
      }

      setDisplayValue(`${prefix}${formattedNum}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        // Enforce exact mathematical final target value to avoid rounding limits
        const finalNum = isFloat ? target.toFixed(1) : target.toString();
        setDisplayValue(`${prefix}${finalNum}${suffix}`);
      }
    };

    requestAnimationFrame(update);
  };

  return <span ref={elementRef} className="tabular-nums">{displayValue}</span>;
}
