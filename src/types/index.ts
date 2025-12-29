export interface Deck {
    id: string;
    name: string;
    share: number;
    color: string;
    img: string;
}

export interface WinRates {
    [attackerId: string]: {
        [defenderId: string]: number;
    };
}
