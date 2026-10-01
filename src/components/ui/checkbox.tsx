import * as React from "react";

import { cn } from "@/lib/utils";

type CheckboxProps = Omit<React.ComponentProps<"input">, "type">;

/** A native checkbox drawn as an inked box with a hand-drawn tick. `className` targets the box. */
function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <span data-slot="checkbox" className="relative inline-grid size-5 shrink-0 place-items-center">
      <input
        type="checkbox"
        className={cn(
          "peer col-start-1 row-start-1 size-5 cursor-pointer appearance-none",
          "rounded-paper border-[1.5px] border-pencil bg-paper-sheet shadow-paper-inset",
          "transition-colors duration-75 checked:bg-paper-accent checked:shadow-paper-flat",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dashed focus-visible:outline-pencil",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "aria-invalid:border-danger",
          className,
        )}
        {...props}
      />
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        fill="none"
        className="pointer-events-none col-start-1 row-start-1 size-4 scale-75 text-ink opacity-0 transition-[opacity,scale] duration-100 peer-checked:scale-100 peer-checked:opacity-100"
      >
        <path
          d="M2.5 8.6c1.1.9 2.2 2.1 3.1 3.6C7.4 8.4 10 5.3 13.6 2.8"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export { Checkbox, type CheckboxProps };
