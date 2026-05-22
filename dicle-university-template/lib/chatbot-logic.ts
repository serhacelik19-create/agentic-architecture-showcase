import { normalizeTurkish } from './turkish-nlp';
import { db } from '@/lib/db';
import { INTENTS as STATIC_INTENTS, FALLBACK_MESSAGE } from './chatbot-data';

// Simple Levenshtein distance for fuzzy matching
function levenshteinDistance(a: string, b: string): number {
    const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));

    for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,       // deletion
                matrix[i][j - 1] + 1,       // insertion
                matrix[i - 1][j - 1] + cost // substitution
            );
        }
    }

    return matrix[a.length][b.length];
}

function calculateSimilarity(str1: string, str2: string): number {
    const maxLength = Math.max(str1.length, str2.length);
    if (maxLength === 0) return 1.0;
    const distance = levenshteinDistance(str1, str2);
    return 1.0 - (distance / maxLength);
}

export type BotResponse = {
    text: string;
    actions?: any[];
    suggestions?: string[];
};

export async function findBestMatch(userInput: string): Promise<BotResponse> {
    // 1. Normalize both input and patterns
    const rawInput = userInput.toLowerCase().trim();
    const stemmedInput = normalizeTurkish(userInput);

    // Fetch intents from DB
    // Optimization: Cache this or use a more efficient search in a real app
    let intents: any[] = [];
    try {
        const dbIntents = await db.chatIntent.findMany({ where: { isActive: true } });
        if (dbIntents.length > 0) {
            intents = dbIntents.map(i => ({
                ...i,
                patterns: JSON.parse(i.patterns) as string[],
                // Mapping DB fields to internal structure if needed, or using as is
                action: i.actions ? JSON.parse(i.actions) : undefined
            }));
        } else {
            // Fallback to static if DB is empty
            intents = STATIC_INTENTS;
        }
    } catch (e) {
        console.error("Chatbot DB error, using static fallback", e);
        intents = STATIC_INTENTS;
    }

    let bestIntent: any | null = null;
    let bestScore = 0;

    // Threshold for acceptance
    const MATCH_THRESHOLD = 0.40;

    for (const intent of intents) {
        for (const pattern of intent.patterns) {
            const normalizedPattern = pattern.toLowerCase();

            // A. Direct inclusion on raw text (Fastest & Exact)
            if (rawInput.includes(normalizedPattern)) {
                return { text: intent.response, actions: intent.action };
            }

            // B. Fuzzy on raw text
            const rawScore = calculateSimilarity(rawInput, normalizedPattern);
            if (rawScore > bestScore) {
                bestScore = rawScore;
                bestIntent = intent;
            }

            // C. Fuzzy on stemmed input
            const stemmedScore = calculateSimilarity(stemmedInput, normalizedPattern);
            if (stemmedScore > bestScore) {
                bestScore = stemmedScore;
                bestIntent = intent;
            }
        }
    }

    if (bestIntent && bestScore >= MATCH_THRESHOLD) {
        return {
            text: bestIntent.response,
            actions: bestIntent.action
        };
    }

    return {
        text: FALLBACK_MESSAGE.text,
        suggestions: FALLBACK_MESSAGE.suggestions
    };
}
