import { KaboomCtx, Vec2 } from "kaboom";

// Typescript Definitions for KaNovel 💋

interface Character {
	name: string;
	sprite: string;
	expressions: CharacterExpression[]
}

interface CharacterExpression {
	name: string;
	sprite: string;
}

interface KaNovelOpt {
	textboxSprite: string;
}

declare global {
	/**
	 * Simply config your Visual Novel
	*/
	function kanovel(
		config: KaNovelOpt
	);

	/**
	 * Define a Character
	 *
	 * @example
	 * ```js
	 * character("b", "Beany", "beany");
	 * ```
	 */
	function character(
		/**
		 * Identifier to use the character
		 */
		id: string,
		/**
		 * Name of the character for appears on the game
		 */
		name: string,
		/**
		 * Default sprite for use it whit show()
		 */
		defaultSprite?: string,
		/**
		 * Expressions of the Character
		*/
		expressions?: CharacterExpression,
	): void;

	/**
	 * Define a chapter
	 *
	 * @example
	 * ```js
	 * chapter("start", () => [
	 *    prota("Ohh today is a great day!"),
	 *    prota("I want..."),
	 *    prota("I want to live a visual novel life!"),
	 * ]);
	 * ```
	 */
	function chapter(
		/**
		 * The title of the chapter
		 */
		title: string,
		/**
		 * Events of the chapter
		 */
		events: any[]
	): void;

	/**
	 * Jump to other chapter
	 */
	function jump(
		chapter: string
	): void;

	/**
	 * Write as the protagonist or a narrator
	 */
	function prota(dialog: string): void;

	/**
	 * Write as a character
	 */
	function char(
		/**
		 * The character's id 
		 */
		id: string,
		/**
		 * Text to say
		 */
		text: string,
	): void;

	/**
	 * Show a character
	*/
	function show(
		charId: string,
		align: "center" | "left" | "right",
	): void;

	/**
	 * Show a background
	*/
	function bg(
		/**
		 * Background's sprite
		*/
		sprite: string,
	): void;

	/**
	 * Play a music
	*/
	function music(
		/**
		 * Audio loaded with Kaboom `loadAudio()`
		*/
		song: string,
	): void;
}

// Custom Components

function fade() {
	let lastTime = 0;

	return {
		id: "fade",
		require: ["opacity"],
		update() {
			if (this.opacity < 1 && time() > lastTime) {
				lastTime = time() + 0.010;

				this.opacity += 0.025;
			}
		},
	}
}

// KaNovel Plugin

export default function kanovelPlugin(k: KaboomCtx) {
	// KANOVEL CODE, BASICALLY THE CORE OF THE CORE OF THE CORE

	function write(dialog: string, char?: Character) {	
		this.textbox.text = "";

		if (char) {
			this.namebox.text = char.name;
			this.curDialog = '"' + dialog + '"';
		}
		else {
			this.namebox.text = "";
			this.curDialog = dialog;
		}

		for (let i = 0; i < this.curDialog.length; i++) {
			k.wait(0.05 * i, () => (this.textbox.text += this.curDialog[i]));
		}
	}

	function showCharacter(char: Character, align: "center" | "left" | "right" = "center") {
		nextEvent();
		
		let charPos: Vec2 = k.vec2(0, 0);

		if (align === "center") charPos = k.center();
		else if (align === "left") charPos = k.vec2(k.width() / 4, k.height() / 2);
		else if (align === "right") charPos = k.vec2(k.width() / 2 + k.width() / 4, k.height() / 2);

		k.add([
			k.sprite(char.sprite),
			k.opacity(0),
			k.origin("center"),
			k.pos(charPos),
			k.layer("characters"),

			fade(),
		]);
	}

	function changeBackground(spr: string) {
		nextEvent();
		
		k.every("bg", (bg) => {
			bg.use(k.lifespan(1, { fade: 0.5 }));
		});

		k.add([
			k.sprite(spr),
			k.opacity(0),
			k.origin("center"),
			k.pos(k.center()),
			k.z(0),
			k.layer("backgrounds"),
			"bg",

			fade(),
		]);
	}

	function changeChapter(chapter: string) {
		if (!this.chapters.get(chapter)) throw new Error(`"${chapter} chapter don't exists!"`);

		this.curChapter = chapter;
		this.curEvent = -1;

		nextEvent();
	}

	function playBGMusic(song: string) {
		nextEvent();
		
		k.play(song, { loop: true });
	}

	function nextEvent() {
		if(this.textbox.text !== this.curDialog) return;
		
		this.curEvent++;
		runEvent(this.chapters.get(this.curChapter)[this.curEvent]);
	}

	function runEvent(event) {
		if(event.length) { 
			for (const e of event) this.runEvent(e) 
		}
		else {
			event();
		}
	}

	// KANOVEL DEFAULT SCENE

	k.scene("vn", (data) => {
		k.layers(["backgrounds", "characters", "textbox"]);

		const textboxBG = k.add([
			k.sprite("textbox"),
			k.origin("bot"),
			k.layer("textbox"),
			k.z(0),
			k.pos(k.width() / 2, k.height() - 20),
		]);

		k.onLoad(() => {
			this.textbox = k.add([
				k.text("", {
					size: 30,
					width: textboxBG.width - 70,
				}),
				k.layer("textbox"),
				k.z(1),
				k.pos(
					textboxBG.pos.sub(
						textboxBG.width / 2 - 50 /*pad*/,
						textboxBG.height - 30 /*pad*/
					)
				),
			]);

			this.namebox = k.add([
				k.text("", { size: 40 }),
				k.layer("textbox"),
				k.z(2),
				k.pos(
					textboxBG.pos.sub(
						textboxBG.width / 2 - 30,
						textboxBG.height + 30
					)
				),
			]);

			nextEvent();
		});

		// Default input for Visual Novel
		
		k.onUpdate(() => {
			if (k.isMousePressed() || k.isKeyPressed("space")) {
				nextEvent();
			}
		});
	});

	// THE REAL KANOVEL PLUGIN 🦋🦋🦋

	return {
		characters: new Map<string, Character>(),
		chapters: new Map(),
		curDialog: "",
		curChapter: "start",
		curEvent: -1,

		// Kanovel Config function

		kanovel(config: KaNovelOpt) {
			
		},

		// Visual Novel Making Functions

		character(id: string, name: string, sprite: string) {
			return this.characters.set(id, {
				name: name,
				sprite: sprite,
			});
		},

		chapter(title: string, events: any) {
			if (this.chapters.get(title)) {
				throw new Error(`You can't repeat the chapter name! "${title}"`);
			}

			return this.chapters.set(title, events());
		},

		// History making functions

		prota(dialog: string) {			
			return () => write(dialog);
		},

		char(id: string, dialog: string) {
			return () => write(dialog, this.characters.get(id));
		},

		show(charId: string, align: "center" | "left" | "right" = "center") {
			return () => showCharacter(this.characters.get(charId), align);
		},

		bg(sprite: string) {
			return () => changeBackground(sprite);
		},

		jump(chapter: string) {
			return () => changeChapter(chapter);
		},

		music(song: string) {
			return () => playBGMusic(song);
		},

		burpy() {
			return () => {
				k.burp();
			};
		}
	};
}
