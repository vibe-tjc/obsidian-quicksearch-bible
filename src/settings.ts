import { App, PluginSettingTab, Setting } from "obsidian";
import type BibleQuickSearchPlugin from "./main";
import type { BibleVersion, Language } from "./types";

export class BibleSearchSettingTab extends PluginSettingTab {
	plugin: BibleQuickSearchPlugin;
	private versions: BibleVersion[] = [];

	constructor(app: App, plugin: BibleQuickSearchPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	async display(): Promise<void> {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl("h2", { text: "Bible QuickSearch settings" });

		this.versions = await this.plugin.db.listBibleVersions();

		this.addBibleVersionSetting(containerEl);
		this.addTriggerPrefixSetting(containerEl);
		this.addMaxResultsSetting(containerEl);
		this.addLanguageSetting(containerEl);
		this.addInsertFormatSetting(containerEl);
	}

	private addBibleVersionSetting(containerEl: HTMLElement): void {
		const setting = new Setting(containerEl)
			.setName("Bible version")
			.setDesc("Select the Bible version to search from the db/ folder");

		if (this.versions.length === 0) {
			setting.setDesc("No Bible databases found. Place .db files in the db/ folder within the plugin directory.");
			setting.addButton((button) =>
				button.setButtonText("Refresh").onClick(async () => {
					await this.display();
				})
			);
		} else {
			setting.addDropdown((dropdown) => {
				dropdown.addOption("", "Select a Bible version");
				for (const version of this.versions) {
					dropdown.addOption(version.filename, version.displayName);
				}
				dropdown.setValue(this.plugin.settings.bibleVersion);
				dropdown.onChange(async (value) => {
					this.plugin.settings.bibleVersion = value;
					await this.plugin.saveSettings();
					if (value) {
						await this.plugin.loadBibleDatabase();
					}
				});
			});
		}
	}

	private addTriggerPrefixSetting(containerEl: HTMLElement): void {
		new Setting(containerEl)
			.setName("Trigger prefix")
			.setDesc("The prefix that triggers Bible verse search (e.g., \"--\" for \"--love\")")
			.addText((text) =>
				text
					.setPlaceholder("--")
					.setValue(this.plugin.settings.triggerPrefix)
					.onChange(async (value) => {
						if (value.trim()) {
							this.plugin.settings.triggerPrefix = value;
							await this.plugin.saveSettings();
							this.plugin.updateSuggester();
						}
					})
			);
	}

	private addMaxResultsSetting(containerEl: HTMLElement): void {
		new Setting(containerEl)
			.setName("Maximum results")
			.setDesc("Maximum number of verse suggestions to display (1-20)")
			.addSlider((slider) =>
				slider
					.setLimits(1, 20, 1)
					.setValue(this.plugin.settings.maxResults)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.maxResults = value;
						await this.plugin.saveSettings();
					})
			);
	}

	private addLanguageSetting(containerEl: HTMLElement): void {
		new Setting(containerEl)
			.setName("Display language")
			.setDesc("Language for book names in suggestions and inserted text")
			.addDropdown((dropdown) => {
				dropdown.addOption("en", "English");
				dropdown.addOption("zh-TW", "繁體中文");
				dropdown.setValue(this.plugin.settings.language);
				dropdown.onChange(async (value) => {
					this.plugin.settings.language = value as Language;
					await this.plugin.saveSettings();
				});
			});
	}

	private addInsertFormatSetting(containerEl: HTMLElement): void {
		new Setting(containerEl)
			.setName("Insert format")
			.setDesc("Format template for inserted verses. Use {book}, {chapter}, {verse}, {text} as placeholders.")
			.addTextArea((text) => {
				text.inputEl.rows = 3;
				text.inputEl.cols = 40;
				text
					.setPlaceholder("{book} {chapter}:{verse} - {text}")
					.setValue(this.plugin.settings.insertFormat)
					.onChange(async (value) => {
						this.plugin.settings.insertFormat = value || "{book} {chapter}:{verse} - {text}";
						await this.plugin.saveSettings();
					});
			});

		containerEl.createEl("p", {
			text: "Example: \"{book} {chapter}:{verse} - {text}\" → \"Genesis 1:1 - In the beginning...\"",
			cls: "setting-item-description",
		});
	}
}
