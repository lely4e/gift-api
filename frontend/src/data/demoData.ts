import type { Poll } from "../utils/types";

export interface DemoProduct {
    id: number;
    title: string;
    emoji: string;
    price: number;
    rating: number;
    votes: number;
    hasVoted: boolean;
}

export interface DemoPoll extends Poll {
    products: DemoProduct[];
}

const daysFromNow = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString();
};

const daysAgo = (days: number) => daysFromNow(-days);

// Catalog available in the "add a product" search — a curated set of
// gift-shaped items with emoji standing in for real product photos, so the
// demo never depends on an external image or search API.
export const DEMO_CATALOG: Omit<DemoProduct, "votes" | "hasVoted">[] = [
    { id: 1, title: "Wireless Noise-Cancelling Headphones", emoji: "🎧", price: 129, rating: 4.5 },
    { id: 2, title: "Espresso Machine", emoji: "☕", price: 189, rating: 4.7 },
    { id: 3, title: "Cozy Wool Blanket", emoji: "🧣", price: 45, rating: 4.3 },
    { id: 4, title: "Board Game Bundle", emoji: "🎲", price: 39, rating: 4.6 },
    { id: 5, title: "Succulent Garden Kit", emoji: "🌵", price: 24, rating: 4.2 },
    { id: 6, title: "Leather Journal", emoji: "📓", price: 28, rating: 4.4 },
    { id: 7, title: "Bluetooth Speaker", emoji: "🔊", price: 59, rating: 4.1 },
    { id: 8, title: "Gourmet Chocolate Box", emoji: "🍫", price: 32, rating: 4.8 },
    { id: 9, title: "Yoga Mat", emoji: "🧘", price: 35, rating: 4.0 },
    { id: 10, title: "Scented Candle Set", emoji: "🕯️", price: 22, rating: 4.5 },
    { id: 11, title: "Portable Charger", emoji: "🔋", price: 19, rating: 3.9 },
    { id: 12, title: "Cookbook: World Kitchens", emoji: "📖", price: 27, rating: 4.6 },
    { id: 13, title: "Desk Plant", emoji: "🪴", price: 18, rating: 4.3 },
    { id: 14, title: "1000-Piece Puzzle", emoji: "🧩", price: 21, rating: 4.4 },
];

const fromCatalog = (id: number, votes: number, hasVoted = false): DemoProduct => {
    const base = DEMO_CATALOG.find((item) => item.id === id)!;
    return { ...base, votes, hasVoted };
};

export const DEMO_ME_USER_ID = 9999;

export const seedMyPolls = (): DemoPoll[] => [
    {
        id: 9001,
        uuid: "demo-my-1",
        title: "Mike's Birthday Bash",
        budget: 450,
        description: "Let's get him something he'll actually use this time 🎉",
        deadline: daysFromNow(6),
        created_at: daysAgo(3),
        user_id: DEMO_ME_USER_ID,
        created_by: "you",
        total_products: 3,
        active: true,
        manually_closed: false,
        products: [
            fromCatalog(1, 8, true),
            fromCatalog(7, 5, false),
            fromCatalog(4, 3, false),
        ],
    },
    {
        id: 9002,
        uuid: "demo-my-2",
        title: "Office Secret Santa",
        budget: 50,
        description: "Keep it fun, keep it under $50",
        deadline: daysFromNow(14),
        created_at: daysAgo(1),
        user_id: DEMO_ME_USER_ID,
        created_by: "you",
        total_products: 0,
        active: true,
        manually_closed: false,
        products: [],
    },
    {
        id: 9003,
        uuid: "demo-my-3",
        title: "Emma's Housewarming",
        budget: 200,
        description: "Thanks everyone — we picked the espresso machine!",
        created_at: daysAgo(30),
        user_id: DEMO_ME_USER_ID,
        created_by: "you",
        total_products: 2,
        active: false,
        manually_closed: true,
        products: [
            fromCatalog(2, 11, true),
            fromCatalog(3, 4, false),
        ],
    },
];

export const seedSharedPolls = (): DemoPoll[] => [
    {
        id: 9004,
        uuid: "demo-shared-1",
        title: "Dad's Retirement Gift",
        budget: 600,
        description: "He keeps saying he wants \"nothing\" — let's ignore that",
        deadline: daysFromNow(10),
        created_at: daysAgo(5),
        user_id: 8001,
        created_by: "Sarah",
        total_products: 4,
        active: true,
        manually_closed: false,
        products: [
            fromCatalog(2, 9, false),
            fromCatalog(1, 6, true),
            fromCatalog(9, 2, false),
            fromCatalog(6, 1, false),
        ],
    },
    {
        id: 9005,
        uuid: "demo-shared-2",
        title: "Book Club Anniversary",
        budget: 80,
        description: "One year of way too many opinions about plot twists",
        created_at: daysAgo(2),
        user_id: 8002,
        created_by: "Jordan",
        total_products: 2,
        active: true,
        manually_closed: false,
        products: [
            fromCatalog(12, 3, false),
            fromCatalog(10, 2, true),
        ],
    },
];
