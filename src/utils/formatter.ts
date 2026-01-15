import type { Verse, Language } from "../types";
import { getBookName } from "../db/books";

export function formatVerse(verse: Verse, format: string, language: Language): string {
	const bookName = getBookName(verse.book, language);

	return format
		.replace("{book}", bookName)
		.replace("{chapter}", String(verse.chapter))
		.replace("{verse}", String(verse.verse))
		.replace("{text}", verse.text);
}

export function truncateText(text: string, maxLength: number): string {
	if (text.length <= maxLength) {
		return text;
	}
	return text.substring(0, maxLength - 3) + "...";
}

export function getVerseReference(verse: Verse, language: Language): string {
	const bookName = getBookName(verse.book, language);
	return `${bookName} ${verse.chapter}:${verse.verse}`;
}
