import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const cardVariants = cva(
  "relative flex flex-col gap-4 rounded-paper border-[1.5px] border-pencil bg-paper py-5 text-ink",
  {
    variants: {
      elevation: {
        flat: "shadow-paper-flat",
        sm: "shadow-paper-sm",
        md: "shadow-paper-md",
        lg: "shadow-paper-lg",
        stack: "shadow-paper-stack",
      },
      cut: {
        straight: "",
        rough: "paper-rough",
      },
      fold: {
        none: "",
        horizontal: "paper-crease",
        vertical: "paper-crease-v",
      },
      texture: {
        none: "",
        dots: "paper-dots",
        ruled: "paper-ruled",
        grid: "paper-grid",
        grain: "paper-grain",
      },
      accent: {
        none: "",
        tape: "washi-tape mt-3",
        "dog-ear": "dog-ear",
      },
    },
    defaultVariants: {
      elevation: "md",
      texture: "none",
      accent: "none",
      cut: "straight",
      fold: "none",
    },
  },
);

type CardProps = React.ComponentProps<"div"> & VariantProps<typeof cardVariants>;

function Card({ className, elevation, texture, accent, cut, fold, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(cardVariants({ elevation, texture, accent, cut, fold }), className)}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-header" className={cn("flex flex-col gap-1.5 px-5", className)} {...props} />;
}

function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="card-title"
      className={cn("font-typewriter text-lg leading-6 font-bold tracking-tight ink-bleed", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="card-description"
      className={cn("font-editorial text-sm leading-6 text-ink-muted", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("px-5 font-editorial leading-6", className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center gap-3 border-t border-dashed border-carbon px-5 pt-4", className)}
      {...props}
    />
  );
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, cardVariants, type CardProps };
