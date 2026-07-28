import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-pill font-semibold leading-none",
  {
    variants: {
      variant: {
        new: "bg-success-subtle text-success-fg",
        popular: "bg-brand-subtle text-brand-dark",
        featured: "bg-gray-900 text-white",
        neutral: "bg-gray-100 text-gray-600",
        published: "bg-success-subtle text-success-fg",
        draft: "bg-gray-100 text-gray-500",
        success: "bg-success-subtle text-success-fg",
        warning: "bg-warning-subtle text-warning-fg",
        danger: "bg-brand-subtle text-brand-dark",
        info: "bg-info-subtle text-info",
      },
      size: {
        sm: "px-2.5 py-1 text-[11px]",
        md: "px-3 py-1.5 text-[11.5px]",
      },
    },
    defaultVariants: {
      variant: "neutral",
      size: "sm",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps): React.JSX.Element {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
