import { KaboomCtx, KaboomPlugin, KaboomOpt } from "kaboom";

// KaNovel plugin function
declare function kanovel(): KaboomCtx & KaNovelPlugin;

/** A position */
export type Position = [
    /** X coordinate */
    number,
    /** Y coordinate */
    number
];

export interface KaNovelOpt extends KaboomOpt {}

/** An action it's all that happens in the novel */
export interface Action {
    id: string;
    run(): any;
    skip(): any;
}

/** A character are the actors of the novel */
export interface Character {
    /** ID of the character */
    id: string;
    /** The visual name of the character */
    name: string;
    /** A default sprite for the character */
    sprite: string;
    expressions: CharacterExpression[];
}

export interface CharacterExpression {
    name: string;
    sprite: string;
}

export interface TextOpt {
    font: string;
    maxWidth: number;
}

export interface TextboxOpt {
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
     * Border of the text of the textbox
     */
    border?: [number, number, number, number];

    /**
     * Text of the textbox
     */
    text?: TextOpt;

    /**
     * Use custom components in the textbox game object
     */
    // components?: CompList<any>;
}

export interface NameboxOpt {
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
    // components?: CompList<any>;
}

export interface ChoiceOpt {
    sprite?: string;
}

export interface KaNovelPluginOpt {
    /**
     * Change the name of the KaNovel's scene
     */
    scene?: string;
    textbox?: TextboxOpt;
    namebox?: NameboxOpt;
    choice?: ChoiceOpt;
}

export interface KaNovelPlugin {
    /**
     * Define a Character
     *
     * @example
     * ```js
     * character("b", "Beany", "beany");
     * ```
     */
    character(
        /**
         * Identifier to use the character
         */
        id: string,
        /**
         * Name of the character
         */
        name: string,
        /**
         * Default sprite for use it whit show()
         */
        defaultSprite?: string,
        /**
         * Expressions of the Character
         */
        expressions?: CharacterExpression[]
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
    chapter(
        /**
         * The title of the chapter
         */
        title: string,
        /**
         * Actions of the chapter
         */
        actions: any[]
    ): void;

    /**
     * Jump to other chapter
     */
    jump(
        /**
         * Chapter to jump
         */
        chapter: string
    ): void;

    /**
     * Write as the protagonist
     */
    prota(dialog: string): void;

    /**
     * Write as the narrator
     */
    narrator(dialog: string): void;

    /**
     * Write as a character
     */
    say(
        /**
         * The character's id
         */
        id: string,
        /**
         * Text to say
         */
        text: string
    ): void;

    /**
     * Show a character
     */
    show(
        charId: string,
        align?: "center" | "left" | "right" | Position,
        expression?: string
    ): void;

    /**
     * Hide a character
     */
    hide(charId: string): void;

    /**
     * Show a background
     */
    bg(
        /**
         * Background's sprite
         */
        sprite: string
    ): void;

    /**
     * Play a music
     */
    music(
        /**
         * Audio loaded with Kaboom `loadAudio()`
         */
        song: string,
        /**
         * The audio volume from 0-100, default 50
         */
        volume: number
    ): void;

    /**
     * Stop a music
     */
    stop_music(
        /**
         * String of the song
         */
        id?: string
    ): void;

    /**
     * Create a choice
     */
    choice(
        /**
         * Cnoices
         */
        ...choices: any[]
    ): void;

    /**
     * End the novel and go to other scene
     */
    end(toGo?: string, endScene?: string, opt?: { withBurp: boolean }): void;

    /**
     * End the novel and go to other scene with burp
     */
    burpy(toGo?: string, endScene?: string): void;
}

export default kanovel;
