/** Generate a stable unique ID for each highlight */
export function generateId(){
    return Math.random().toString(36).substring(2,10) + Date.now().toString(36)
}

/** Build the localStorage key scoped to book + user */
export function storageKey(bookId, userId) {
    return `pdf_highlights_${bookId}_${userId ?? "anonymous"}`
}

export function loadHighlights(bookId, userId) {
    try {
        const raw = localStorage.getItem(storageKey(bookId, userId));
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export function saveHighlights(bookId, userId, highlights) {
    try {
        localStorage.setItem(storageKey(bookId, userId), JSON.stringify(highlights));
    } catch {
        /* quota exceeded – fail silently */
    }
}