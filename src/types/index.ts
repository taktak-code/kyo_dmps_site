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
    visible?: boolean;  // 省略時はtrue扱い
}

export interface WinRates {
    [playerId: string]: {
        [opponentId: string]: number | string;
    };
}
