import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const inputVariants = cva(
  [
    "w-full min-w-0 font-typewriter text-sm text-ink placeholder:text-ink-muted/70",
    "transition-[border-color,box-shadow] duration-100 outline-none",
    "disabled:cursor-not-allowed disabled:bg-paper-muted disabled:opacity-60",
    "aria-invalid:border-danger aria-invalid:text-danger",
    "file:mr-3 file:border-0 file:bg-transparent file:font-typewriter file:text-sm file:font-bold file:text-ink",
  ],
  {
    variants: {
      variant: {
        /** Boxed field pressed into the sheet. */
        boxed: [
          "h-10 rounded-paper border-[1.5px] border-pencil bg-paper-sheet px-3 shadow-paper-inset",
          "focus-visible:ring-2 focus-visible:ring-pencil/25 focus-visible:ring-offset-0",
        ],
        /** A single ruled notebook line to write on. */
        underline: [
          "h-9 rounded-none border-0 border-b-2 border-carbon bg-transparent px-1",
          "focus-visible:border-pencil",
        ],
      },
    },
    defaultVariants: {
      variant: "boxed",
    },
  },
);

type InputProps = React.ComponentProps<"input"> & VariantProps<typeof inputVariants>;

function Input({ className, variant, type = "text", ...props }: InputProps) {
  return <input data-slot="input" type={type} className={cn(inputVariants({ variant }), className)} {...props} />;
}

export { Input, inputVariants, type InputProps };
