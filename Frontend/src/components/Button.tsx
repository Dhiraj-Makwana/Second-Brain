import type { ReactElement } from "react";

interface ButtonProps {
    variant: "primary" | "secondary",
    text: string,
    startIcon?: ReactElement,
    onClick?: () => void,
}

const variantClass = {
    "primary": "bg-blue-600 text-white",
    "secondary": "bg-blue-200 text-blue-600"
}

const defaultStyles = "px-4 py-2 rounded-md font-normal flex items-center justify-center gap-2 cursor-pointer"

export function Button({ variant, text, startIcon, onClick }: ButtonProps) {
    return <button onClick={onClick} className={ variantClass[variant]+ " "+ defaultStyles }>
        {startIcon}
        {text}
    </button>
}