import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Reusable Button component
 * Follows the clean, rounded design system.
 */

const cn = (...inputs) => twMerge(clsx(inputs));

export const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', as: Component = 'button', ...props }, ref) => {
  const variants = {
    primary: "bg-primary text-primary-foreground hover:opacity-90 active:scale-95 shadow-sm",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-95",
    outline: "border border-border bg-transparent hover:bg-secondary active:scale-95",
    ghost: "bg-transparent hover:bg-secondary active:scale-95",
    destructive: "bg-destructive text-destructive-foreground hover:opacity-90 active:scale-95"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-lg",
    md: "px-5 py-2.5 text-sm rounded-xl font-medium",
    lg: "px-8 py-3.5 text-base rounded-2xl font-semibold",
    icon: "p-2 rounded-xl"
  };

  return (
    <Component
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
});

Button.displayName = 'Button';
