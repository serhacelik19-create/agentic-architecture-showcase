export function normalizeTurkish(text: string): string {
    if (!text) return "";

    let normalized = text.toLowerCase().trim();

    // Convert English chars to Turkish equivalents for better matching if needed, 
    // or just standardize to English chars. Let's standardize to English chars for fuzzy matching simplicity.
    // Actually, keeping Turkish chars is fine if patterns have them.
    // Let's just handle lowercasing properly with locale.
    normalized = normalized.toLocaleLowerCase('tr-TR');

    // Common Turkish Suffixes to strip (Naive Stemming)
    // We want to turn "dağkapıya" -> "dağkapı", "kampüsten" -> "kampüs"
    // Order matters: longer suffixes first.
    const suffixes = [
        "'den", "'dan", "'ten", "'tan", "'ye", "'ya", "'ne", "'na", "'nun", "'nin",
        "den", "dan", "ten", "tan", "te", "ta", "de", "da", "ye", "ya", "ne", "na",
        "inin", "nın", "nin", "nun", "nün", "ı", "i", "u", "ü", "lar", "ler"
    ];

    // Logic: Remove suffix if the word ends with it and remaining part is long enough
    const words = normalized.split(/\s+/);
    const stemmedWords = words.map(word => {
        // Remove punctuation
        let cleanWord = word.replace(/[.,?!:;()]/g, "");

        for (const suffix of suffixes) {
            if (cleanWord.endsWith(suffix) && cleanWord.length > suffix.length + 2) {
                return cleanWord.slice(0, -suffix.length);
            }
        }
        return cleanWord;
    });

    return stemmedWords.join(" ");
}
