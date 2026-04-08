import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 focus-visible:ring-offset-2 aria-invalid:border-destructive active:scale-[0.97]",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-200 hover:from-blue-700 hover:to-blue-600 hover:shadow-lg hover:shadow-blue-300 hover:-translate-y-px",
        destructive:
          "bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-md shadow-red-200 hover:from-red-700 hover:to-rose-600",
        outline:
          "border-2 border-blue-200 bg-white text-blue-700 hover:bg-blue-50 hover:border-blue-400",
        secondary:
          "bg-blue-50 text-blue-700 hover:bg-blue-100",
        ghost:
          "text-gray-700 hover:bg-blue-50 hover:text-blue-600",
        link: "text-gray-700 underline-offset-4 hover:underline hover:text-blue-600",
      },
      size: {
        default: "h-9 px-5 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-lg gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-11 rounded-xl px-7 has-[>svg]:px-5 text-base",
        icon: "size-9 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
