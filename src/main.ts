/* eslint-disable obsidianmd/ui/sentence-case */

import { Notice, Plugin } from "obsidian";
import { type BibleSearchSettings, DEFAULT_SETTINGS } from "./types";
import { BibleSearchSettingTab } from "./settings";
import { BibleDatabase } from "./db/database";
import { BibleSuggester } from "./ui/bible-suggester";

export default class BibleQuickSearchPlugin extends Plugin {
	settings: BibleSearchSettings;
	db: BibleDatabase;
	private suggester: BibleSuggester | null = null;

	async onload(): Promise<void> {
		await this.loadSettings();

		const pluginDir = this.manifest.dir || "";
		this.db = new BibleDatabase(this.app, pluginDir);

		this.suggester = new BibleSuggester(this);
		this.registerEditorSuggest(this.suggester);

		this.addSettingTab(new BibleSearchSettingTab(this.app, this));

		if (this.settings.bibleVersion) {
			await this.loadBibleDatabase();
		}
	}

	onunload(): void {
		this.db.close();
	}

	async loadSettings(): Promise<void> {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData(),
		) as BibleSearchSettings;
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}

	async loadBibleDatabase(): Promise<void> {
		if (!this.settings.bibleVersion) {
			return;
		}

		const success = await this.db.loadDatabase(this.settings.bibleVersion);
		if (success) {
			new Notice(
				`Bible loaded: ${this.settings.bibleVersion.replace(/\.(db|sqlite|sqlite3)$/, "")}`,
			);
		} else {
			console.error("Failed to load Bible database.");
			new Notice(
				"Failed to load Bible database. Check the console for details.",
			);
		}
	}
}
