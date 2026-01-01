export interface Season {
    id: string;
    name: string;
}

export interface SeasonsData {
    current: string;
    all: Season[];
}
