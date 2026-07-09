import React, { forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white border-2 border-border hover:bg-primary-dark shadow-[4px_4px_0px_0px_var(--color-border)] hover:shadow-[2px_2px_0px_0px_var(--color-border)] hover:translate-y-[2px] hover:translate-x-[2px]',
  secondary: 'bg-secondary text-black border-2 border-border hover:bg-[#0891b2] shadow-[4px_4px_0px_0px_var(--color-border)] hover:shadow-[2px_2px_0px_0px_var(--color-border)] hover:translate-y-[2px] hover:translate-x-[2px]',
  outline: 'bg-transparent text-foreground border-2 border-border hover:border-primary hover:text-primary',
  ghost: 'bg-transparent text-foreground hover:bg-muted hover:text-primary border-2 border-transparent',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg font-bold',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-heading uppercase transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none';
    
    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

    return (
      <button ref={ref} className={combinedClassName} {...props} />
    );
  }
);

Button.displayName = 'Button';
