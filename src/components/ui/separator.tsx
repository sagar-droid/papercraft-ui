import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const separatorVariants = cva("shrink-0 border-0 border-carbon", {
  variants: {
    variant: {
      perforated: "border-dashed",
      dotted: "border-dotted",
      solid: "border-solid",
      double: "border-double",
    },
    orientation: {
      horizontal: "my-4 h-0 w-full border-b",
      vertical: "mx-3 h-auto self-stretch border-l",
    },
  },
  compoundVariants: [
    { variant: "double", orientation: "horizontal", className: "border-b-[3px]" },
    { variant: "double", orientation: "vertical", className: "border-l-[3px]" },
  ],
  defaultVariants: {
    variant: "perforated",
    orientation: "horizontal",
  },
});

type SeparatorProps = React.ComponentProps<"div"> &
  VariantProps<typeof separatorVariants> & {
    /** Purely visual separators are hidden from assistive tech. */
    decorative?: boolean;
  };

function Separator({ className, variant, orientation = "horizontal", decorative = true, ...props }: SeparatorProps) {
  const a11y = decorative
    ? { role: "none" as const }
    : { role: "separator" as const, "aria-orientation": orientation ?? "horizontal" };

  return (
    <div
      data-slot="separator"
      data-orientation={orientation}
      className={cn(separatorVariants({ variant, orientation }), className)}
      {...a11y}
      {...props}
    />
  );
}

export { Separator, separatorVariants, type SeparatorProps };
