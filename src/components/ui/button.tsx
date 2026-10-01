import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap select-none",
    "font-typewriter text-sm font-bold tracking-tight text-ink",
    "transition-[translate,box-shadow,background-color,border-color] duration-75",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dashed focus-visible:outline-pencil",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        /** Cardstock stamp: rests on a hard shadow, presses flat on click. */
        default: [
          "rounded-paper border-[1.5px] border-pencil bg-paper shadow-paper-sm",
          "hover:translate-x-px hover:translate-y-px hover:shadow-paper-xs",
          "active:translate-x-[2px] active:translate-y-[2px] active:shadow-paper-flat",
        ],
        /** Solid ink stamp for the primary action. */
        ink: [
          "rounded-paper border-[1.5px] border-pencil bg-ink text-paper shadow-paper-sm",
          "hover:translate-x-px hover:translate-y-px hover:shadow-paper-xs",
          "active:translate-x-[2px] active:translate-y-[2px] active:shadow-paper-flat",
        ],
        /** Crimson stamp for destructive actions. */
        destructive: [
          "rounded-paper border-[1.5px] border-pencil bg-danger text-paper-sheet shadow-paper-sm",
          "hover:translate-x-px hover:translate-y-px hover:shadow-paper-xs",
          "active:translate-x-[2px] active:translate-y-[2px] active:shadow-paper-flat",
        ],
        /** Torn / perforated coupon. */
        perforated: [
          "rounded-paper border-2 border-dashed border-pencil bg-transparent",
          "hover:bg-paper-muted active:translate-y-px",
        ],
        /** Bare text that gains a pencil underline on hover. */
        ghost: [
          "rounded-none border-b-2 border-transparent bg-transparent",
          "hover:border-pencil hover:bg-paper-muted/60",
        ],
        /** Inline hyperlink with a dashed ink underline. */
        link: "h-auto px-0 underline decoration-dashed decoration-1 underline-offset-4 hover:decoration-solid",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        default: "h-10 px-4",
        lg: "h-12 px-6 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>;

function Button({ className, variant, size, type = "button", ...props }: ButtonProps) {
  return (
    <button
      data-slot="button"
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants, type ButtonProps };
