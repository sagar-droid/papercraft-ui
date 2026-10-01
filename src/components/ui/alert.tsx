import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  [
    "relative grid w-full grid-cols-[0_1fr] items-start gap-y-1 rounded-paper border-[1.5px] border-l-[6px] px-4 py-3 text-ink",
    "has-[>svg]:grid-cols-[1.25rem_1fr] has-[>svg]:gap-x-3 [&>svg]:size-5 [&>svg]:translate-y-0.5",
  ],
  {
    variants: {
      variant: {
        default: "border-pencil bg-paper-sheet [&>svg]:text-ink",
        info: "border-info bg-paper-sheet [&>svg]:text-info",
        danger: "border-danger bg-paper-sheet [&>svg]:text-danger",
        highlight: "border-pencil bg-highlight/60",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type AlertProps = React.ComponentProps<"div"> & VariantProps<typeof alertVariants>;

function Alert({ className, variant, ...props }: AlertProps) {
  return <div data-slot="alert" role="alert" className={cn(alertVariants({ variant }), className)} {...props} />;
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn("col-start-2 font-typewriter text-sm font-bold tracking-tight", className)}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn("col-start-2 font-editorial text-sm leading-6 text-ink-muted", className)}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription, alertVariants, type AlertProps };
