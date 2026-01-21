import initSqlJs, { Database, SqlValue } from "sql.js";
import type { App } from "obsidian";
import type { Verse, BibleVersion } from "../types";

const DB_FOLDER = "db";

export class BibleDatabase {
	private app: App;
	private db: Database | null = null;
	private pluginDir: string;

	constructor(app: App, pluginDir: string) {
		this.app = app;
		this.pluginDir = pluginDir;
	}

	async listBibleVersions(): Promise<BibleVersion[]> {
		const dbPath = `${this.pluginDir}/${DB_FOLDER}`;
		const versions: BibleVersion[] = [];

		try {
			const exists = await this.app.vault.adapter.exists(dbPath);
			if (!exists) {
				return versions;
			}

			const files = await this.app.vault.adapter.list(dbPath);
			for (const file of files.files) {
				if (file.endsWith(".db") || file.endsWith(".sqlite") || file.endsWith(".sqlite3")) {
					const filename = file.split("/").pop() || file;
					const displayName = filename.replace(/\.(db|sqlite|sqlite3)$/, "");
					versions.push({ filename, displayName });
				}
			}
		} catch (error) {
			console.error("Failed to list Bible versions:", error);
		}

		return versions;
	}

	async loadDatabase(filename: string): Promise<boolean> {
		try {
			this.close();

			const dbPath = `${this.pluginDir}/${DB_FOLDER}/${filename}`;
			const exists = await this.app.vault.adapter.exists(dbPath);
			if (!exists) {
				console.error(`Database file not found: ${dbPath}`);
				return false;
			}

			const SQL = await initSqlJs({
				locateFile: (file: string) => `https://sql.js.org/dist/${file}`,
			});

			const buffer = await this.app.vault.adapter.readBinary(dbPath);
			this.db = new SQL.Database(new Uint8Array(buffer));

			return true;
		} catch (error) {
			console.error("Failed to load database:", error);
			return false;
		}
	}

	searchVerses(query: string, limit: number): Verse[] {
		if (!this.db || !query.trim()) {
			return [];
		}

		try {
			// Normalize Unicode to NFC form for consistent matching
			const normalizedQuery = query.normalize("NFC");

			// The database has spaces between Chinese characters (e.g., "凡 事" instead of "凡事")
			// Create a LIKE pattern with optional spaces between each character
			const chars = [...normalizedQuery];
			const sanitizedChars = chars.map(c => {
				if (c === "'") return "''";
				if (c === "%") return "\\%";
				if (c === "_") return "\\_";
				if (c === " ") return "% %"; // Space in query matches space in DB
				return c;
			});
			// Join with "% %" to match optional space between characters
			const likePattern = sanitizedChars.join("% %");

			const sql = `
				SELECT id, book, chapter, verse, text
				FROM verses
				WHERE text LIKE '%${likePattern}%' ESCAPE '\\'
				LIMIT ${limit}
			`;

			const results = this.db.exec(sql);
			const result = results[0];

			if (!result) {
				return [];
			}

			return result.values.map((row: SqlValue[]) => ({
				id: row[0] as number,
				book: row[1] as number,
				chapter: row[2] as number,
				verse: row[3] as number,
				text: this.cleanChineseText(row[4] as string),
			}));
		} catch (error) {
			console.error("Search error:", error);
			return [];
		}
	}

	isLoaded(): boolean {
		return this.db !== null;
	}

	/**
	 * Remove spaces between CJK characters and punctuation.
	 * The database stores Chinese text with spaces between each character.
	 */
	private cleanChineseText(text: string): string {
		// CJK character class: ideographs, punctuation, and fullwidth forms
		const cjk = "\\u4e00-\\u9fff\\u3000-\\u303f\\uff00-\\uffef";
		// Match a CJK char followed by spaces and capture the rest using a lookahead
		// This handles consecutive CJK characters with spaces between them
		const pattern = new RegExp(`([${cjk}])\\s+(?=[${cjk}])`, "g");
		return text.replace(pattern, "$1");
	}

	close(): void {
		if (this.db) {
			this.db.close();
			this.db = null;
		}
	}
}
