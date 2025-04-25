
import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";

import { cn } from "@/lib/utils";

const toggleVariants = (options = {}) => {
  const { variant = "default", size = "default" } = options;
  
  const variants = {
    default: "bg-transparent",
    outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
  };

  const sizes = {
    default: "h-10 px-3",
    sm: "h-9 px-2.5",
    lg: "h-11 px-5",
  };

  return cn(
    "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
    variants[variant],
    sizes[size]
  );
};

const Toggle = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size }), className)}
    {...props}
  />
));

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };
