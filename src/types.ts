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
    autoskip?: boolean;
    run(): void | Promise<void>;
    skip?(): any;
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

export interface CharacterOpt {
    color: string;
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
     *    say("Ohh today is a great day!"),
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

    /** Write in the textbox
     *
     * @example
     * ```js
     * // write as narrator
     * say("Sack is so stupid")
     * ```
     */
    say(
        /** Text to say */
        text: string
    ): Action;

    /** Write in the textbox as character */
    say(
        /** The character's id */
        id: string,
        /** Text to say */
        text: string
    ): Action;

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
     * Show a character
     */
    show(charId: string, align?: "center" | "left" | "right" | Position, expression?: string): void;

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

    /** Plays a music */
    playMusic(
        /** Audio loaded with Kaboom `loadAudio()` */
        song: string,
        /** The audio volume from 0-100, default 50 */
        volume: number
    ): Action;

    /** Stop a music */
    stopMusic(
        /** Song */
        song: string
    ): Action;

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
