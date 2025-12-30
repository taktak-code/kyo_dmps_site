import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

export function getCellColor(rate: number | string | undefined | null): string {
    if (rate === undefined || rate === null || rate === "N/A" || rate === "-") return 'rgba(30, 41, 59, 0.5)';

    const numRate = typeof rate === 'string' ? parseInt(rate, 10) : rate;

    if (isNaN(numRate)) return 'rgba(30, 41, 59, 0.5)';

    if (numRate >= 65) return 'rgba(22, 163, 74, 0.8)';
    if (numRate >= 55) return 'rgba(34, 197, 94, 0.4)';
    if (numRate >= 45) return 'rgba(234, 179, 8, 0.2)';
    if (numRate >= 35) return 'rgba(239, 68, 68, 0.4)';
    return 'rgba(185, 28, 28, 0.8)';
}
