export interface Deck {
    id: string;
    name: string;
    share: number;
    img: string;
}

export interface WinRates {
    [attackerId: string]: {
        [defenderId: string]: number | string;
    };
}
