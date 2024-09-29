import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * @function cn
 * @description Merges Tailwind CSS classes using clsx and twMerge for conditional class handling.
 * @param {...ClassValue[]} inputs - The classes to merge and conditionally apply.
 * @returns {string} The merged class names.
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}