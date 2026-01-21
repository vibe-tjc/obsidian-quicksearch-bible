import {
	Editor,
	EditorPosition,
	EditorSuggest,
	EditorSuggestContext,
	EditorSuggestTriggerInfo,
	TFile,
} from "obsidian";
import type BibleQuickSearchPlugin from "../main";
import type { Verse } from "../types";
import { formatVerse, getVerseReference, truncateText } from "../utils/formatter";

export class BibleSuggester extends EditorSuggest<Verse> {
	plugin: BibleQuickSearchPlugin;

	constructor(plugin: BibleQuickSearchPlugin) {
		super(plugin.app);
		this.plugin = plugin;
	}

	onTrigger(cursor: EditorPosition, editor: Editor, _file: TFile | null): EditorSuggestTriggerInfo | null {
		if (!this.plugin.db.isLoaded()) {
			return null;
		}

		const fullLine = editor.getLine(cursor.line);
		const prefix = this.plugin.settings.triggerPrefix;

		// Handle edge case where cursor.ch might exceed line length during IME composition
		const safeEndCh = Math.min(cursor.ch, fullLine.length);
		const lineText = fullLine.substring(0, safeEndCh);
		const prefixIndex = lineText.lastIndexOf(prefix);

		if (prefixIndex === -1) {
			return null;
		}

		const query = lineText.substring(prefixIndex + prefix.length);

		return {
			start: { line: cursor.line, ch: prefixIndex },
			end: { line: cursor.line, ch: safeEndCh },
			query: query,
		};
	}

	getSuggestions(context: EditorSuggestContext): Verse[] {
		const query = context.query.trim();

		if (!query) {
			return [];
		}

		return this.plugin.db.searchVerses(query, this.plugin.settings.maxResults);
	}

	renderSuggestion(verse: Verse, el: HTMLElement): void {
		const container = el.createDiv({ cls: "bible-suggestion" });

		const reference = container.createDiv({ cls: "bible-suggestion-reference" });
		reference.setText(getVerseReference(verse, this.plugin.settings.language));

		const preview = container.createDiv({ cls: "bible-suggestion-preview" });
		preview.setText(truncateText(verse.text, 80));
	}

	selectSuggestion(verse: Verse, _evt: MouseEvent | KeyboardEvent): void {
		if (!this.context) {
			return;
		}

		const formattedVerse = formatVerse(
			verse,
			this.plugin.settings.insertFormat,
			this.plugin.settings.language
		);

		this.context.editor.replaceRange(
			formattedVerse,
			this.context.start,
			this.context.end
		);
	}
}
