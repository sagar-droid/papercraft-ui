import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const textareaVariants = cva(
  [
    "flex min-h-24 w-full resize-y font-editorial text-base text-ink placeholder:text-ink-muted/70 outline-none",
    "disabled:cursor-not-allowed disabled:opacity-60",
    "aria-invalid:border-danger",
  ],
  {
    variants: {
      variant: {
        boxed: [
          "rounded-paper border-[1.5px] border-pencil bg-paper-sheet px-3 py-2 leading-6 shadow-paper-inset",
          "focus-visible:ring-2 focus-visible:ring-pencil/25",
        ],
        /** Notebook page: text sits on the ruled lines (24px rhythm). */
        ruled: [
          "paper-ruled rounded-paper border-[1.5px] border-pencil bg-paper-sheet px-3 pt-0 pb-0 leading-6",
          "border-l-[3px] border-l-danger/60",
          "focus-visible:ring-2 focus-visible:ring-pencil/25",
        ],
      },
    },
    defaultVariants: {
      variant: "boxed",
    },
  },
);

type TextareaProps = React.ComponentProps<"textarea"> & VariantProps<typeof textareaVariants>;

function Textarea({ className, variant, ...props }: TextareaProps) {
  return <textarea data-slot="textarea" className={cn(textareaVariants({ variant }), className)} {...props} />;
}

export { Textarea, textareaVariants, type TextareaProps };
