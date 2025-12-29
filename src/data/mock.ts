import type { Deck, WinRates } from '../types';

export const DECK_DATA: Deck[] = [
    { id: 'apollo', name: '赤白アポロ', share: 15, color: '#EF4444', img: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=400&q=80" },
    { id: 'outrage', name: 'アウトレイジ', share: 15, color: '#F97316', img: "https://images.unsplash.com/photo-1579546673177-471f641881d4?auto=format&fit=crop&w=400&q=80" },
    { id: 'endurance', name: '耐久', share: 10, color: '#60A5FA', img: "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=400&q=80" },
    { id: 'linne', name: 'リンネ', share: 5, color: '#9333EA', img: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&w=400&q=80" },
    { id: 'jokers', name: 'ジョーカーズ', share: 5, color: '#FACC15', img: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=400&q=80" },
    { id: 'metallica', name: 'メタリカ', share: 5, color: '#94A3B8', img: "https://images.unsplash.com/photo-1558591710-4b4a1ad0f048?auto=format&fit=crop&w=400&q=80" },
    { id: 'nero', name: 'ネロ天門', share: 5, color: '#4338CA', img: "https://images.unsplash.com/photo-1464802686167-b939a6910659?auto=format&fit=crop&w=400&q=80" },
    { id: 'vv8', name: 'VV8', share: 5, color: '#06B6D4', img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80" },
    { id: 'alien', name: 'エイリアン', share: 5, color: '#16A34A', img: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=400&q=80" },
    { id: 'buster', name: '赤黒バスター', share: 0, color: '#991B1B', img: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&w=400&q=80" },
];

export const WIN_RATES: WinRates = {
    'apollo': { 'outrage': 30, 'endurance': 45, 'linne': 60, 'jokers': 60, 'metallica': 70, 'nero': 40, 'vv8': 50, 'alien': 30, 'buster': 55 },
    'outrage': { 'apollo': 70, 'endurance': 50, 'linne': 55, 'jokers': 65, 'metallica': 60, 'nero': 30, 'vv8': 40, 'alien': 70, 'buster': 65 },
    'endurance': { 'apollo': 55, 'outrage': 50, 'linne': 70, 'jokers': 60, 'metallica': 60, 'nero': 40, 'vv8': 20, 'alien': 30, 'buster': 65 },
    'linne': { 'apollo': 35, 'outrage': 60, 'endurance': 60, 'jokers': 30, 'metallica': 60, 'nero': 70, 'vv8': 20, 'alien': 60, 'buster': 65 },
    'jokers': { 'apollo': 35, 'outrage': 35, 'endurance': 40, 'linne': 70, 'metallica': 35, 'nero': 70, 'vv8': 70, 'alien': 70, 'buster': 55 },
    'metallica': { 'apollo': 30, 'outrage': 40, 'endurance': 40, 'linne': 40, 'jokers': 65, 'nero': 60, 'vv8': 60, 'alien': 65, 'buster': 45 },
    'nero': { 'apollo': 60, 'outrage': 70, 'endurance': 60, 'linne': 30, 'jokers': 30, 'metallica': 40, 'vv8': 50, 'alien': 40, 'buster': 65 },
    'vv8': { 'apollo': 50, 'outrage': 60, 'endurance': 80, 'linne': 80, 'jokers': 30, 'metallica': 40, 'nero': 50, 'alien': 70, 'buster': 65 },
    'alien': { 'apollo': 70, 'outrage': 30, 'endurance': 70, 'linne': 40, 'jokers': 30, 'metallica': 35, 'nero': 60, 'vv8': 30, 'buster': 45 },
    'buster': { 'apollo': 45, 'outrage': 35, 'endurance': 35, 'linne': 35, 'jokers': 45, 'metallica': 55, 'nero': 35, 'vv8': 35, 'alien': 55 },
};
