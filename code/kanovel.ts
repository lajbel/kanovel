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
}

// Custom Components

function fade() {
	let lastTime = 0;
	
    return {
        id: "fade",
        require: [ "opacity" ],
        update() {
            if(this.opacity < 1 && time() > lastTime) {
				lastTime = time() + 0.010;

				this.opacity += 0.025;
			}
        },
    }
}

// KaNovel Plugin
export default function kanovelPlugin(k: KaboomCtx) {
	k.scene("vn", (data) => {
		k.layers(["backgrounds", "characters", "textbox"]);

		const textboxBG = k.add([
			k.sprite("textbox"),
			k.origin("bot"),
			k.layer("textbox"),
			k.z(0),
			k.pos(k.width() / 2, k.height() - 20),
		]);

		onLoad(() => {
			this.textbox = add([
				text("", { size: 30, width: textboxBG.width - 50 }),
				layer("textbox"),
				z(1),
				pos(
					textboxBG.pos.sub(
						textboxBG.width / 2 - 50 /*pad*/,
						textboxBG.height - 30 /*pad*/
					)
				),
			]);

			this.namebox = add([
				text("", { size: 40 }),
				layer("textbox"),
				z(2),
				pos(
					textboxBG.pos.sub(
						textboxBG.width / 2 - 30,
						textboxBG.height + 30
					)
				),
			]);

			this.passDialogue();
		});

		// Default input for Visual Novel
		onUpdate(() => {
			if (isMousePressed() || isKeyPressed("space")) {
				this.passDialogue();
			}
		});
	});

	// THE REAL KANOVEL PLUGIN 🦋🦋🦋

	return {
		characters: new Map<string, Character>(),
		chapters: new Map(),
		curDialog: "",
		curChapter: "start",
		curEvent: 0,

		// Kanovel Config function

		kanovel() {

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

		jump(chapter: string) {
			return () => this.changeChapter(chapter);
		},

		// History making functions

		prota(dialog: string) {
			return () => this.write("", dialog);
		},

		char(id: string, dialog: string) {
			return () => this.write(this.characters.get(id), dialog);
		},

		show(charId: string, align: "center" | "left" | "right") {
			return () => this.showChar(this.characters.get(charId), align);
		},

		bg(sprite: string) {
			return () => this.changeBackground(sprite);
		},

		// Core Functions

		write(char: any, dialog: string) {

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
				wait(0.05 * i, () => (this.textbox.text += this.curDialog[i]));
			}
		},

		checkAction(action) {
			if (action.length) {
				for (const act of action) this.checkAction(act);
			} else {
				action();
			}
		},

		passDialogue() {
			if (this.textbox.text !== this.curDialog) return;

			this.checkAction(this.chapters.get(this.curChapter)[this.curEvent]);

			this.curEvent++;
		},

		showChar(char: Character, align: "center" | "left" | "right") {
			let charPos: Vec2 = k.vec2(0, 0);

			if (align === "center") charPos = k.center();
			else if (align === "left") charPos = k.vec2(k.width() / 4, k.height() / 2);
			else if (align === "right") charPos = k.vec2(k.width() / 2 + k.width() / 4, k.height() / 2);
			else charPos = k.center();

			k.add([
				k.sprite(char.sprite),
				k.origin("center"),
				k.pos(charPos),
				k.layer("characters"),
				k.opacity(0),
				
				fade(),
			]);
		},

		changeBackground(spr: string) {
			k.every("bg", (bg) => {
				bg.use(k.lifespan(1, { fade: 0.5 }));
			});

			const bg = k.add([
				k.sprite(spr),
				k.opacity(0),
				k.origin("center"),
				k.pos(k.center()),
				k.z(0),
				k.layer("backgrounds"),
				"bg",

				fade(),
			]);

			bg.use(z(0));
		},

		changeChapter(chapter: string) {
			if (!this.chapters.get(chapter)) throw new Error(`"${chapter} chapter don't exists!"`);

			this.curChapter = chapter;
			this.curEvent = 0;

			this.passDialogue();
		},
	};
}
