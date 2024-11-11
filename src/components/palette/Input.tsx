import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [value, setValue] = React.useState("");
    return (
      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={cn(
          "border border-input bg-transparent px-3 py-1 text-base shadow-sm outline-none",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
