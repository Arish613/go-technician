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
  pauseOnHover?: boolean;
}

export function Marquee({
  children,
  direction = "left",
  speed = 40,
  gap = 16,
  pauseOnHover = false,
  className,
  ...props
}: MarqueeProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  const animationPlayState = pauseOnHover && isHovered ? "paused" : "running";

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  return (
    <div
      className={cn("group relative flex overflow-hidden", className)}
      onMouseEnter={pauseOnHover ? handleMouseEnter : undefined}
      onMouseLeave={pauseOnHover ? handleMouseLeave : undefined}
      {...props}
    >
      <div
        className="flex shrink-0 items-center justify-around animate-marquee px-4"
        style={{
          gap: `${gap}px`,
          animationDuration: `${speed}s`,
          animationDirection: direction === "right" ? "reverse" : "normal",
          animationPlayState,
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
          animationPlayState,
        }}
      >
        {children}
      </div>
    </div>
  );
}
