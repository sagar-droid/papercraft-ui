import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/** A strip of tape that pins its (positioned) parent to the page. */
const tapeVariants = cva("pointer-events-none absolute z-10 h-6 w-20 paper-tape", {
  variants: {
    position: {
      top: "-top-3 left-1/2 -translate-x-1/2 -rotate-2",
      "top-left": "-top-1 -left-6 -rotate-[38deg]",
      "top-right": "-top-1 -right-6 rotate-[38deg]",
      "bottom-left": "-bottom-1 -left-6 rotate-[38deg]",
      "bottom-right": "-bottom-1 -right-6 -rotate-[38deg]",
    },
    color: {
      washi: "bg-highlight/55",
      scotch: "bg-stone-50/45 backdrop-blur-[0.5px]",
      pink: "bg-pink-300/55",
      blue: "bg-sky-300/55",
      kraft: "bg-amber-700/40",
    },
  },
  defaultVariants: {
    position: "top",
    color: "washi",
  },
});

type TapeProps = Omit<React.ComponentProps<"span">, "color"> & VariantProps<typeof tapeVariants>;

function Tape({ className, position, color, ...props }: TapeProps) {
  return (
    <span
      data-slot="tape"
      aria-hidden
      className={cn(tapeVariants({ position, color }), className)}
      {...props}
    />
  );
}

export { Tape, tapeVariants, type TapeProps };
