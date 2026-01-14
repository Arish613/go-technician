"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The direction of the marquee animation.
   * @default "left"
   */
  direction?: "left" | "right";
  /**
   * The speed of the marquee animation in seconds.
   * @default 40
   */
  speed?: number;
  /**
   * The gap between items in pixels.
   * @default 16
   */
  gap?: number;
}

export function Marquee({
  children,
  direction = "left",
  speed = 40,
  gap = 16,
  className,
  ...props
}: MarqueeProps) {
  return (
    <div
      className={cn("group relative flex overflow-hidden", className)}
      {...props}
    >
      <div
        className="flex shrink-0 items-center justify-around animate-marquee px-4"
        style={{
          gap: `${gap}px`,
          animationDuration: `${speed}s`,
          animationDirection: direction === "right" ? "reverse" : "normal",
        }}
      >
        {children}
      </div>
      <div
        aria-hidden="true"
        className="flex shrink-0 items-center justify-around animate-marquee px-4"
        style={{
          gap: `${gap}px`,
          animationDuration: `${speed}s`,
          animationDirection: direction === "right" ? "reverse" : "normal",
        }}
      >
        {children}
      </div>
    </div>
  );
}
