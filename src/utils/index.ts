import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

export function getCellColor(rate: number | undefined | null): string {
    if (rate === undefined || rate === null) return 'rgba(30, 41, 59, 0.5)';
    if (rate >= 65) return 'rgba(22, 163, 74, 0.8)';
    if (rate >= 55) return 'rgba(34, 197, 94, 0.4)';
    if (rate >= 45) return 'rgba(234, 179, 8, 0.2)';
    if (rate >= 35) return 'rgba(239, 68, 68, 0.4)';
    return 'rgba(185, 28, 28, 0.8)';
}
