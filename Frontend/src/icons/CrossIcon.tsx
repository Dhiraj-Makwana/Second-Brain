interface CrossIconProps {
    size?: "sm" | "md" | "lg"
}

const sizeVariants = {
    "sm": "size-2",
    "md": "size-5",
    "lg": "size-6"
}

export function CrossIcon(props: CrossIconProps) {
    return <svg className={`text-red-800 hover:text-red-500 dark:text-white ${sizeVariants[props.size || "sm"]}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
</svg>


}