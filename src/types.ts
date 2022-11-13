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

export interface SkippableAction extends Action {
    /** Avoid the auto skip of the action, and waits the user click */
    noSkip(): Action;
}

/** A character are the actors of the novel */
export interface Character {
    /** Character's id */
    id: string;
    /** Character's display name */
    name: string;
    /** Character's options and extras */
    opt: CharacterOpt;
}

/** A **chapter** it's how the novel its stored in the time. */
export interface Chapter {}

export interface CharacterOpt {
    /** Character's display name colour. */
    color?: string;
    /** Character's expressions. */
    expressions?: { [name: string]: string };
}

export interface TextOpt {
    font: string;
    maxWidth: number;
}

export interface TextboxOpt {
    /** Kaboom loaded sprite for use in textbox */
    sprite?: string;

    /** Textbox's position (x, y) */
    pos?: Position;

    /** Textbox's width */
    width?: number;

    /** Textbox's height */
    height?: number;

    /** Textbox's text size */
    size?: number;

    /** Textbox's text font */
    font?: string;

    /** Textbox's text border */
    border?: [number, number, number, number];
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
     * Define a character.
     *
     * @example
     * ```js
     * character("b", "Beany");
     * ```
     */
    character(
        /**
         * Identifier to use the character.
         */
        id: string,
        /**
         * Name of the character.
         */
        name: string,
        /**
         * Options of character.
         */
        opt?: CharacterOpt
    ): void;

    /**
     * Define a chapter.
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
         * The title of the chapter.
         */
        title: string,
        /**
         * Actions of the chapter.
         */
        actions: () => Action[]
    ): void;

    /** Write in the textbox.
     *
     * @example
     * ```js
     * // write as narrator
     * say("Sack is so stupid")
     * ```
     */
    say(
        /** Text to say. */
        text: string
    ): Action;

    /** Write in the textbox as character. */
    say(
        /** The character's id */
        id: string,
        /** Text to say */
        text: string
    ): Action;

    /**
     * Jump to other chapter.
     */
    jump(
        /**
         * Chapter to jump
         */
        chapter: string
    ): Action;

    /**
     * Show a character.
     */
    show(
        character: string,
        expression: string,
        align?: "center" | "left" | "right" | Position
    ): SkippableAction;

    /**
     * Hide a character.
     */
    hide(charId: string): Action;

    /** Plays a music. */
    playMusic(
        /** Audio loaded with Kaboom `loadAudio()` */
        song: string,
        /** The audio volume from 0-100, default 50 */
        volume: number
    ): Action;

    /** Stop a music. */
    stopMusic(
        /** Song */
        song: string
    ): Action;

    showTextbox(): Action;

    hideTextbox(): Action;
}

export default kanovel;
