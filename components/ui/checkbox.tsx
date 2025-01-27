"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface CheckboxProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
    "onChange"
  > {
  onChange?: (status: boolean) => void;
}

const Checkbox = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
  >(({ className, onChange, checked, ...props }, ref) => {
  const [isChecked, setIsChecked] = useState<CheckboxPrimitive.CheckedState>(!!checked);

  const handleCheckedChange = (state: CheckboxPrimitive.CheckedState) => {
    setIsChecked(!!state);
    if (onChange) {
      onChange(state as boolean);
    }
  };

  useEffect(() => {
    if (typeof checked !== "undefined") {
      setIsChecked(!!checked);
    }
  }, [checked]);
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        className,
      )}
      checked={isChecked}
      onCheckedChange={(state) => handleCheckedChange(state as boolean)}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn("flex items-center justify-center text-current")}
      >
        <Check className="h-4 w-4" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
