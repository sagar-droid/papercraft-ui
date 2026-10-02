import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/** A wire paper clip gripping the top edge of its (positioned) parent. */
const paperClipVariants = cva("pointer-events-none absolute -top-6 z-10 h-14 w-5", {
  variants: {
    position: {
      left: "left-6 -rotate-6",
      center: "left-1/2 -translate-x-1/2",
      right: "right-6 rotate-6",
    },
    color: {
      steel: "text-stone-300",
      brass: "text-amber-400",
      red: "text-red-400",
      blue: "text-sky-400",
    },
  },
  defaultVariants: {
    position: "left",
    color: "steel",
  },
});

const WIRE = "M7 40V12a3 3 0 0 1 6 0v34a5 5 0 0 1-10 0V8a7 7 0 0 1 14 0v30";

type PaperClipProps = Omit<React.ComponentProps<"svg">, "color"> & VariantProps<typeof paperClipVariants>;

function PaperClip({ className, position, color, ...props }: PaperClipProps) {
  return (
    <svg
      data-slot="paper-clip"
      aria-hidden
      viewBox="0 0 20 54"
      fill="none"
      strokeLinecap="round"
      className={cn(paperClipVariants({ position, color }), className)}
      {...props}
    >
      {/* Dark outline under a lighter wire reads as bent metal */}
      <path d={WIRE} className="stroke-pencil" strokeWidth={3.25} />
      <path d={WIRE} stroke="currentColor" strokeWidth={1.5} />
    </svg>
  );
}

export { PaperClip, paperClipVariants, type PaperClipProps };
