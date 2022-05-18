import kaboom, { GameObj, KaboomCtx } from "kaboom";

// Typescript Definitions
declare global {
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
		 * Sprite for use it whit show()
		 */
		sprite: string
	): void;

	/**
	 * Define a Chapter
	 *
	 * @example
	 * ```js
	 * chapter("start", () => [
	 *     prota("Ohh today is a great day!"),
	 *	   prota("I want..."),
	 *	   prota("I want live a visual novel life!"),
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
}


// KaNovel Plugin
export default function kanovel(k) {
	return {
		chapters: new Map(),
		characters: new Map(),
		curDialog: "",
		curChapter: "start",
		curEvent: 0,

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

		jump(chapter) {
			return () => this.changeChapter(chapter);
		},

		// History making functions

		prota(dialog) {
			return () => this.write("", dialog);
		},

		char(id, text) {
			return () => this.write(this.characters.get(id), text);
		},

		show(charId) {
			return () => this.showChar(this.characters.get(charId));
		},

		bg(sprite) {
			return () => this.changeBackground(sprite);
		},

		// Core Functions

		write(char, text) {
			if (char) this.namebox.text = char.name;
			else this.namebox.text = "";

			this.textbox.text = "";
			this.curDialog = text;

			for (let i = 0; i < text.length; i++) {
				wait(0.05 * i, () => (this.textbox.text += text[i]));
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

		showChar(char) {
			add([
				sprite(char.sprite),
				k.origin("center"),
				pos(center()),
				layer("characters"),
			]);
		},

		changeBackground(spr) {
			every("background", (bg) => {
				bg.use(lifespan(1, { fade: 0.5 }));
			});

			const bg = add([
				sprite(spr),
				k.origin("center"),
				z(0),
				pos(center()),
				layer("backgrounds"),
				"background",
			]);

			bg.use(z(0));
		},

		changeChapter(chapter) {
			if (!this.chapters.get(chapter)) {
				throw new Error(`"${chapter} chapter don't exists!"`);
			}

			this.curChapter = chapter;
			this.curEvent = 0;

			this.passDialogue();
		},

		startNovel() {
			// Layers of the game
			layers(["backgrounds", "characters", "textbox"]);

			const textboxBG = add([
				sprite("textbox"),
				k.origin("bot"),
				layer("textbox"),
				z(0),
				pos(width() / 2, height() - 20),
				{
					isWriting: false,
				},
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
		},
	};
}
