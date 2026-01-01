export interface MatrixData {
    season?: string;
    decks: Deck[];
    winRates: WinRates;
    tierListImage?: string;
}

export interface Deck {
    id: string;
    name: string;
    img: string;
}

export interface WinRates {
    [attackerId: string]: {
        [defenderId: string]: number | string;
    };
}
