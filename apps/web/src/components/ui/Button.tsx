import Link from "next/link";
import { ReactNode } from "react";

interface ButtonProps {
    children: ReactNode;
    href?: string;
    onClick?: () => void;
    className?: string;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    variant?: "primary" | "outline";
}

export default function Button({
    children,
    href,
    onClick,
    className = "",
    type = "button",
    disabled,
    variant = "primary"
}: ButtonProps) {

    const baseClasses = "inline-flex items-center justify-center font-semibold text-micro uppercase tracking-wider px-7 py-3 rounded-[3px] transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed";

    // Unike klasser for de ulike variantene
    const variantClasses = {
        primary: "border border-transparent bg-brand-rust text-brand-dark hover:bg-brand-accent active:bg-brand-accent shadow-sm",
        outline: "bg-none border border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-brand-light active:text-brand-accent hover:border-brand-accent active:border-brand-accent"
    };

    const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`.trim();

    if (href) {
        return (
            <Link href={href} className={combinedClasses}>
                {children}
            </Link>
        );
    }

    return (
        <button type={type} onClick={onClick} className={combinedClasses} disabled={disabled}>
            {children}
        </button>
    );
}