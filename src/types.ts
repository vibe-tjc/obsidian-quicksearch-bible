export interface Verse {
	id: number;
	book: number;
	chapter: number;
	verse: number;
	text: string;
}

export interface BibleVersion {
	filename: string;
	displayName: string;
}

export type Language = "en" | "zh-TW";

export interface BibleSearchSettings {
	bibleVersion: string;
	triggerPrefix: string;
	maxResults: number;
	language: Language;
	insertFormat: string;
}

export const DEFAULT_SETTINGS: BibleSearchSettings = {
	bibleVersion: "",
	triggerPrefix: "--",
	maxResults: 5,
	language: "en",
	insertFormat: "{book} {chapter}:{verse} - {text}",
};
