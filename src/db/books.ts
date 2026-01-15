import type { Language } from "../types";

interface BookNames {
	en: string;
	"zh-TW": string;
}

const BIBLE_BOOKS: Record<number, BookNames> = {
	// Old Testament
	1: { en: "Genesis", "zh-TW": "創世記" },
	2: { en: "Exodus", "zh-TW": "出埃及記" },
	3: { en: "Leviticus", "zh-TW": "利未記" },
	4: { en: "Numbers", "zh-TW": "民數記" },
	5: { en: "Deuteronomy", "zh-TW": "申命記" },
	6: { en: "Joshua", "zh-TW": "約書亞記" },
	7: { en: "Judges", "zh-TW": "士師記" },
	8: { en: "Ruth", "zh-TW": "路得記" },
	9: { en: "1 Samuel", "zh-TW": "撒母耳記上" },
	10: { en: "2 Samuel", "zh-TW": "撒母耳記下" },
	11: { en: "1 Kings", "zh-TW": "列王紀上" },
	12: { en: "2 Kings", "zh-TW": "列王紀下" },
	13: { en: "1 Chronicles", "zh-TW": "歷代志上" },
	14: { en: "2 Chronicles", "zh-TW": "歷代志下" },
	15: { en: "Ezra", "zh-TW": "以斯拉記" },
	16: { en: "Nehemiah", "zh-TW": "尼希米記" },
	17: { en: "Esther", "zh-TW": "以斯帖記" },
	18: { en: "Job", "zh-TW": "約伯記" },
	19: { en: "Psalms", "zh-TW": "詩篇" },
	20: { en: "Proverbs", "zh-TW": "箴言" },
	21: { en: "Ecclesiastes", "zh-TW": "傳道書" },
	22: { en: "Song of Solomon", "zh-TW": "雅歌" },
	23: { en: "Isaiah", "zh-TW": "以賽亞書" },
	24: { en: "Jeremiah", "zh-TW": "耶利米書" },
	25: { en: "Lamentations", "zh-TW": "耶利米哀歌" },
	26: { en: "Ezekiel", "zh-TW": "以西結書" },
	27: { en: "Daniel", "zh-TW": "但以理書" },
	28: { en: "Hosea", "zh-TW": "何西阿書" },
	29: { en: "Joel", "zh-TW": "約珥書" },
	30: { en: "Amos", "zh-TW": "阿摩司書" },
	31: { en: "Obadiah", "zh-TW": "俄巴底亞書" },
	32: { en: "Jonah", "zh-TW": "約拿書" },
	33: { en: "Micah", "zh-TW": "彌迦書" },
	34: { en: "Nahum", "zh-TW": "那鴻書" },
	35: { en: "Habakkuk", "zh-TW": "哈巴谷書" },
	36: { en: "Zephaniah", "zh-TW": "西番雅書" },
	37: { en: "Haggai", "zh-TW": "哈該書" },
	38: { en: "Zechariah", "zh-TW": "撒迦利亞書" },
	39: { en: "Malachi", "zh-TW": "瑪拉基書" },
	// New Testament
	40: { en: "Matthew", "zh-TW": "馬太福音" },
	41: { en: "Mark", "zh-TW": "馬可福音" },
	42: { en: "Luke", "zh-TW": "路加福音" },
	43: { en: "John", "zh-TW": "約翰福音" },
	44: { en: "Acts", "zh-TW": "使徒行傳" },
	45: { en: "Romans", "zh-TW": "羅馬書" },
	46: { en: "1 Corinthians", "zh-TW": "哥林多前書" },
	47: { en: "2 Corinthians", "zh-TW": "哥林多後書" },
	48: { en: "Galatians", "zh-TW": "加拉太書" },
	49: { en: "Ephesians", "zh-TW": "以弗所書" },
	50: { en: "Philippians", "zh-TW": "腓立比書" },
	51: { en: "Colossians", "zh-TW": "歌羅西書" },
	52: { en: "1 Thessalonians", "zh-TW": "帖撒羅尼迦前書" },
	53: { en: "2 Thessalonians", "zh-TW": "帖撒羅尼迦後書" },
	54: { en: "1 Timothy", "zh-TW": "提摩太前書" },
	55: { en: "2 Timothy", "zh-TW": "提摩太後書" },
	56: { en: "Titus", "zh-TW": "提多書" },
	57: { en: "Philemon", "zh-TW": "腓利門書" },
	58: { en: "Hebrews", "zh-TW": "希伯來書" },
	59: { en: "James", "zh-TW": "雅各書" },
	60: { en: "1 Peter", "zh-TW": "彼得前書" },
	61: { en: "2 Peter", "zh-TW": "彼得後書" },
	62: { en: "1 John", "zh-TW": "約翰一書" },
	63: { en: "2 John", "zh-TW": "約翰二書" },
	64: { en: "3 John", "zh-TW": "約翰三書" },
	65: { en: "Jude", "zh-TW": "猶大書" },
	66: { en: "Revelation", "zh-TW": "啟示錄" },
};

export function getBookName(bookId: number, language: Language): string {
	const book = BIBLE_BOOKS[bookId];
	if (!book) {
		return `Book ${bookId}`;
	}
	return book[language];
}

export function getAllBooks(language: Language): Array<{ id: number; name: string }> {
	return Object.entries(BIBLE_BOOKS).map(([id, names]) => ({
		id: parseInt(id),
		name: names[language],
	}));
}
