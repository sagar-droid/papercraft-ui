import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center gap-1 whitespace-nowrap font-typewriter text-xs font-bold tracking-wide [&_svg]:size-3",
  {
    variants: {
      variant: {
        /** Manila tag. */
        default: "border-[1.5px] border-pencil bg-paper-accent text-ink",
        outline: "border-[1.5px] border-pencil bg-transparent text-ink",
        /** Inked rubber stamps — slightly crooked, double-struck border. */
        danger: "-rotate-2 border-2 border-double border-danger bg-transparent text-danger uppercase",
        info: "-rotate-1 border-2 border-double border-info bg-transparent text-info uppercase",
        /** Highlighter swipe. */
        highlight: "border-transparent bg-highlight text-ink",
      },
      shape: {
        tag: "rounded-paper px-2 py-0.5",
        pill: "rounded-full px-2.5 py-0.5",
      },
    },
    defaultVariants: {
      variant: "default",
      shape: "tag",
    },
  },
);

type BadgeProps = React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>;

function Badge({ className, variant, shape, ...props }: BadgeProps) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant, shape }), className)} {...props} />;
}

export { Badge, badgeVariants, type BadgeProps };
