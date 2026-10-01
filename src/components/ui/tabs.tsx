"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type TabsContextValue = {
  baseId: string;
  value: string;
  setValue: (value: string) => void;
};

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabs(component: string) {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error(`<${component}> must be used within <Tabs>`);
  return ctx;
}

type TabsProps = Omit<React.ComponentProps<"div">, "defaultValue" | "onChange"> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

/** Manila-folder tabs. Controlled (`value` + `onValueChange`) or uncontrolled (`defaultValue`). */
function Tabs({ value: valueProp, defaultValue = "", onValueChange, className, ...props }: TabsProps) {
  const baseId = React.useId();
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const value = valueProp ?? uncontrolled;

  const setValue = React.useCallback(
    (next: string) => {
      if (valueProp === undefined) setUncontrolled(next);
      onValueChange?.(next);
    },
    [valueProp, onValueChange],
  );

  return (
    <TabsContext.Provider value={{ baseId, value, setValue }}>
      <div data-slot="tabs" className={cn("flex flex-col", className)} {...props} />
    </TabsContext.Provider>
  );
}

function TabsList({ className, onKeyDown, ...props }: React.ComponentProps<"div">) {
  // Roving focus between tabs with the arrow / Home / End keys.
  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const tabs = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)'),
    );
    const index = tabs.indexOf(document.activeElement as HTMLButtonElement);
    if (index === -1) return;

    const nextIndex = {
      ArrowRight: (index + 1) % tabs.length,
      ArrowLeft: (index - 1 + tabs.length) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    }[event.key];
    if (nextIndex === undefined) return;

    event.preventDefault();
    tabs[nextIndex]?.focus();
    tabs[nextIndex]?.click();
  }

  return (
    <div
      data-slot="tabs-list"
      role="tablist"
      className={cn("relative z-10 -mb-[1.5px] flex items-end gap-1 px-2", className)}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
}

type TabsTriggerProps = Omit<React.ComponentProps<"button">, "value"> & { value: string };

function TabsTrigger({ value, className, onClick, ...props }: TabsTriggerProps) {
  const ctx = useTabs("TabsTrigger");
  const active = ctx.value === value;

  return (
    <button
      data-slot="tabs-trigger"
      data-state={active ? "active" : "inactive"}
      type="button"
      role="tab"
      id={`${ctx.baseId}-trigger-${value}`}
      aria-controls={`${ctx.baseId}-content-${value}`}
      aria-selected={active}
      tabIndex={active ? 0 : -1}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) ctx.setValue(value);
      }}
      className={cn(
        "cursor-pointer rounded-t-paper-md border-[1.5px] border-b-0 border-pencil px-4 font-typewriter text-sm font-bold whitespace-nowrap",
        "transition-[padding,background-color] duration-100",
        "focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-dashed focus-visible:outline-pencil",
        "disabled:pointer-events-none disabled:opacity-50",
        "data-[state=active]:bg-paper data-[state=active]:py-2 data-[state=active]:text-ink",
        "data-[state=inactive]:bg-paper-accent data-[state=inactive]:py-1.5 data-[state=inactive]:text-ink-muted data-[state=inactive]:hover:text-ink",
        className,
      )}
      {...props}
    />
  );
}

type TabsContentProps = React.ComponentProps<"div"> & { value: string };

function TabsContent({ value, className, ...props }: TabsContentProps) {
  const ctx = useTabs("TabsContent");
  if (ctx.value !== value) return null;

  return (
    <div
      data-slot="tabs-content"
      role="tabpanel"
      id={`${ctx.baseId}-content-${value}`}
      aria-labelledby={`${ctx.baseId}-trigger-${value}`}
      tabIndex={0}
      className={cn(
        "rounded-paper border-[1.5px] border-pencil bg-paper p-5 text-ink shadow-paper-md outline-none",
        className,
      )}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent, type TabsProps };
