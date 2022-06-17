// The KaNovel's plugin

import { KaboomCtx, Vec2, GameObj, CompList } from "kaboom";

// Typescript Definitions for KaNovel 💋

type Position = [
    /**
     * X coordinate
    */
    number,
    /**
     * Y coordinate
    */
    number,
]

interface Event {
    id: string,
    exe: any,
    skip: boolean,
}

interface Character {
    name: string;
    sprite: string;
    expressions: CharacterExpression[]
}

interface CharacterExpression {
    name: string;
    sprite: string;
}

interface TextboxOpt {
    /**
     * Kaboom loaded sprite for use in textbox
    */
    sprite?: string;

    /**
     * Position of the Textbox
    */
    pos?: Position;

    /**
     * Width of the textbox
    */
    width?: number;

    /**
     * Height of the textbox
    */
    height?: number;

    /**
     * Size of the text of the textbox
    */
    size?: number;

    /**
     * Padding of the text of the textbox
    */
    padding?: [number, number];

    /**
     * Use custom components in the textbox game object
    */
    components?: CompList<any>;
}

interface NameboxOpt {
    /**
     * Kaboom loaded sprite for use in namebox
    */
    sprite?: string;

    /**
     * Width of the namebox
    */
    width?: number;

    /**
     * Height of the namebox
    */
    height?: number;

    /**
     * Use custom components in the namebox game object
    */
    components?: CompList<any>;
}

interface ChoiceOpt {
    sprite: string;
}

interface KaNovelOpt {
    /**
     * Change the name of the KaNovel's scene
    */
    scene: string;
    textbox: TextboxOpt;
    namebox: NameboxOpt;
    choice: ChoiceOpt;
}

declare global {
    /**
     * Load KaNovel's configuration
    */
    function kanovel(
        config: KaNovelOpt
    ): void;

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
        /**
         * Chapter to jump
        */
        chapter: string
    ): void;

    /**
     * Write as the protagonist
     */
    function prota(dialog: string): void;

    /**
     * Write as the narrator
     */
    function narrator(dialog: string): void;

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
        align?: "center" | "left" | "right" | Position,
    ): void;

    /**
     * Hide a character
    */
    function hide(
        charId: string,
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

    /**
     * Create a choice
    */
    function choice(
        /**
         * Cnoices
        */
        ...choices: any[],
    ): void;
}

// Custom Components and functions

function fade() {
    let timer = 0;

    return {
        id: "fade",
        fadeIn(time: number = 1) {
            const cancelFadeIn = onUpdate(() => {
                if (this.opacity > 1) return cancelFadeIn();

                timer += dt();

                this.opacity = map(timer, 0, time, 0, 1);
            });
        },

        fadeOut() {
            this.use(lifespan(1, { fade: 1 }));
        },
    }
}

function array2Vec2(arr: number[]) {
    return vec2(arr[0], arr[1]);
}

// KaNovel Plugin

export default function kanovelPlugin(k: KaboomCtx) {
    // KANOVEL CODE, BASICALLY THE CORE OF THE CORE OF THE CORE

    let config: KaNovelOpt;

    const layers = {
        bg: 0,
        chars: 1,
        textbox: 2,
        text: 3,
        name: 4,
        choices: 5,
    };

    function addTextbox(conf?: TextboxOpt) {
        const textboxWidth = conf?.width || k.width();
        const textboxHeight = conf?.height || k.height() / 4;
        const textboxPadding = array2Vec2(conf?.padding) || k.vec2(20, 20);

        // textbox
        const textboxBG = k.add([
            conf.sprite ?
                k.sprite(conf.sprite) :
                k.rect(textboxWidth, textboxHeight),
            k.origin("bot"),
            k.z(layers.textbox),
            k.pos(conf.pos ? array2Vec2(conf.pos) : k.vec2(k.width() / 2, k.height() - 20)),
        ]);

        // text
        this.textbox = k.add([
            k.text("", { size: conf.size | 30, width: textboxWidth }),
            k.pos(textboxBG.pos.sub(
                textboxBG.width / 2 - textboxPadding.x,
                textboxBG.height - textboxPadding.y,
            )),
            k.z(layers.text),
        ]);

        // namebox
        this.namebox = k.add([
            k.text("", { size: 40 }),
            k.pos(textboxBG.pos.sub(
                textboxBG.width / 2 - 30,
                textboxBG.height + 30
            )),
            k.z(layers.name),
        ]);
    }

    async function write(dialog: string, character?: Character) {
        this.skip = false;
        this.textbox.text = "";

        if (character) {
            this.namebox.text = character.name;
            this.curDialog = '"' + dialog + '"';
        }
        else {
            this.namebox.text = "";
            this.curDialog = dialog;
        }

        for (let i = 0; i < this.curDialog.length; i++) {
            if (this.skip) break;

            await k.wait(0.05, () => {
                if (this.skip) return;

                this.textbox.text += this.curDialog[i];
            });
        }
    }

    function skipText() {
        this.skip = true;

        this.textbox.text = this.curDialog;
    };

    function addChoices(choices) {
        const basePos = k.vec2(k.width() / 2, k.height() / 4);
        let lastChoice: GameObj;

        for (let i = 0; i < choices.length; i++) {
            lastChoice = k.add([
                config.choice?.sprite ?
                    k.sprite(config.choice?.sprite) :
                    k.rect(k.width() - 40, k.height() / 8),
                k.origin("center"),
                k.pos(lastChoice ? lastChoice.pos.add(0, basePos.y) : basePos.clone()),
                k.z(layers.choices),
                k.area(),
                "choice",
                {
                    choice: i,
                }
            ]);

            k.add([
                k.text(choices[i][0]),
                k.origin("center"),
                k.pos(lastChoice.pos.clone()),
                k.z(layers.choices),
                "choiceText"
            ]);

            const cancelChoice = k.onUpdate("choice", (c) => {
                if (c.isClicked()) {
                    k.every("choice", k.destroy);
                    k.every("choiceText", k.destroy);

                    checkChoice(choices[c.choice]);

                    return cancelChoice();
                }
            });
        }
    };

    function checkChoice(choice) {
        runEvent(choice[1]);
    };

    function showCharacter(char: Character, align: "center" | "left" | "right" | Position = "center") {
        let charPos: Vec2 = k.vec2(0, 0);

        if (align === "center") charPos = k.center();
        else if (align === "left") charPos = k.vec2(k.width() / 4, k.height() / 2);
        else if (align === "right") charPos = k.vec2(k.width() / 2 + k.width() / 4, k.height() / 2);
        else if (align) charPos = array2Vec2(align);
            
        k.add([
            k.sprite(char.sprite),
            k.opacity(0),
            k.origin("center"),
            k.pos(charPos),
            k.z(layers.chars),
            char.name,

            fade(),
        ]).fadeIn();
    }

    function hideCharacter(char: Character) {
        k.get(char.name).forEach(c => {
            c.fadeOut();
        });
    }

    function changeBackground(spr: string) {
        k.every("bg", (bg) => {
            bg.use(k.lifespan(1, { fade: 0.5 }));
        });

        k.add([
            k.sprite(spr),
            k.opacity(0),
            k.origin("center"),
            k.pos(k.center()),
            k.z(layers.bg),
            "bg",

            fade(),
        ]).fadeIn();
    }

    function changeChapter(chapter: string) {
        if (!this.chapters.get(chapter)) throw new Error(`"${chapter} chapter don't exists!"`);

        this.curChapter = chapter;
        this.curEvent = 0;
    }

    function loadChapter(title, events) {
        if (this.chapters.get(title)) throw new Error(`You can't repeat the chapter name! "${title}"`);

        this.chapters.set(title, events());
    }

    function playBGMusic(song: string) {
        const bgm = k.play(song, { loop: true });

        this.curPlaying.set(bgm, bgm);
    }

    function stopMusic(id?: string) {
        if (id) {
            this.curPlaying.get(id)?.stop();
        }
        else {
            this.curPlaying.forEach((id, audio) => {
                audio.stop();
            });
        }
    }

    function nextEvent() {
        if (k.get("choice").length) return;
        if (this.textbox.text !== this.curDialog) return skipText();

        runEvent(this.chapters.get(this.curChapter)[this.curEvent], this.chapters.get(this.curChapter)[this.curEvent + 1]);

        this.curEvent++;
    }

    async function runEvent(event: any, next?: any) {
        if (event.length) {
            for (const e of event) runEvent(e, this.chapters.get(this.curChapter)[this.curEvent + 1])
        }
        else {
            await event.exe();

            if (event.skip) nextEvent();
            else if (next?.id === "choice") nextEvent();
        }
    }

    // KANOVEL SCENE

    k.onLoad(() => {
        k.scene(config?.scene || "kanovel", (data) => {
            if(config?.textbox) addTextbox(config.textbox);
            else addTextbox();

            k.onLoad(nextEvent);

            // Default input for Visual Novel

            k.onUpdate(() => {
                if (k.isMousePressed() || k.isKeyPressed("space")) {
                    nextEvent();
                }
            });
        });
    })


    // THE REAL KANOVEL PLUGIN 🦋🦋🦋

    return {
        characters: new Map<string, Character>(),
        chapters: new Map(),
        curDialog: "",
        curChapter: "start",
        curEvent: 0,
        curPlaying: new Map(),
        history: [],
        skip: false,

        // Kanovel function

        kanovel(c: KaNovelOpt) {
            config = c;
        },

        // Visual Novel Making Functions

        character(id: string, name: string, sprite: string) {
            this.characters.set(id, {
                name: name,
                sprite: sprite,
            });
        },

        chapter(title: string, events: any) {
            loadChapter(title, events);
        },

        // History making functions

        prota(dialog: string) {
            return {
                id: "prota",
                exe: () => write(dialog)
            }
        },

        narrator(dialog: string) {
            return {
                id: "narrator",
                exe: () => write(dialog)
            }
        },

        char(id: string, dialog: string) {
            return {
                id: "dialog",
                exe: () => write(dialog, this.characters.get(id)),
            }
        },

        // Display

        show(charId: string, align: "center" | "left" | "right" = "center") {
            return {
                id: "show",
                exe: () => showCharacter(this.characters.get(charId), align),
                skip: true,
            }
        },

        hide(charId: string) {
            return {
                id: "hide",
                exe: () => hideCharacter(this.characters.get(charId)),
                skip: true,
            }
        },

        choice(...choices) {
            return {
                id: "choice",
                exe: () => addChoices(choices),
            }
        },

        bg(sprite: string) {
            return {
                id: "bg",
                exe: () => changeBackground(sprite),
                skip: true,
            }
        },

        jump(chapter: string) {
            return {
                id: "jump",
                exe: () => changeChapter(chapter),
                skip: true,
            }
        },

        music(song: string) {
            return {
                id: "music",
                exe: () => playBGMusic(song),
                skip: true,
            }
        },

        stop(id?: string) {
            return {
                id: "stop",
                exe: () => stopMusic(id),
                skip: true,
            }
        },

        burpy(endScene: string = "end") {
            return {
                id: "burpy",
                exe: () => {
                    k.burp();
                    stopMusic();
                    k.go(endScene);
                },
            }
        },
    };
}