import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-btn font-medium transition-colors cursor-pointer disabled:pointer-events-none disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
  {
    variants: {
      variant: {
        brand: "bg-brand text-white hover:bg-brand-hover disabled:bg-brand-disabled",
        outline:
          "border border-gray-200 bg-white text-ink hover:border-border-strong",
        ghost: "text-ink hover:bg-gray-50",
        dark: "bg-gray-900 text-white hover:bg-black",
        whatsapp: "bg-whatsapp text-white hover:bg-whatsapp-dark",
        subtle: "bg-gray-50 text-ink hover:bg-gray-100",
        danger:
          "border border-danger-subtle bg-white text-danger hover:bg-danger-subtle",
      },
      size: {
        sm: "h-10 px-4 text-[14px]",
        md: "h-12 px-6 text-[16px]",
        lg: "h-[52px] px-7 text-[16px]",
        xl: "h-14 px-8 text-[16px]",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "brand",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
