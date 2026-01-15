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
	private triggerPattern: RegExp;

	constructor(plugin: BibleQuickSearchPlugin) {
		super(plugin.app);
		this.plugin = plugin;
		this.updateTriggerPattern();
	}

	updateTriggerPattern(): void {
		const prefix = this.escapeRegex(this.plugin.settings.triggerPrefix);
		this.triggerPattern = new RegExp(`${prefix}(\\S*)$`);
	}

	private escapeRegex(str: string): string {
		return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	}

	onTrigger(cursor: EditorPosition, editor: Editor, _file: TFile | null): EditorSuggestTriggerInfo | null {
		if (!this.plugin.db.isLoaded()) {
			return null;
		}

		const lineText = editor.getLine(cursor.line).substring(0, cursor.ch);
		const match = lineText.match(this.triggerPattern);

		if (!match) {
			return null;
		}

		const startPos = cursor.ch - match[0].length;

		return {
			start: { line: cursor.line, ch: startPos },
			end: cursor,
			query: match[1] || "",
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
