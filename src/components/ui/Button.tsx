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

    const baseClasses = "inline-flex items-center justify-center font-semibold px-7 py-3 rounded-[3px] transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed";

    // Unike klasser for de ulike variantene
    const variantClasses = {
        primary: "bg-brand-rust text-brand-dark text-micro uppercase tracking-wider hover:bg-brand-accent shadow-sm",
        outline: "bg-transparent border-1 border-brand-rust text-brand-rust hover:bg-brand-accetn hover:text-brand-accent hover:border-brand-accent"
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