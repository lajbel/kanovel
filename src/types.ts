import type { KaboomCtx, KaboomOpt, Comp, GameObj } from "kaboom";

// KaNovel plugin function
declare function kanovel(opt?: KaNovelOpt): KaboomCtx & KaNovelPlugin;

/** A position */
export type Position = [
    /** X coordinate */
    number,
    /** Y coordinate */
    number
];

export interface KaNovelOpt extends KaboomOpt {
    textbox?: TextboxOpt;
    namebox?: NameboxOpt;
}

/** An action it's all that happens in the novel */
export interface Action {
    /** Action's id */
    id: string;
    autoskip?: boolean;

    /** The function runned  */
    run(): void | Promise<void>;

    skip?(): any;
}

export interface EffectsAction extends Action {
    fadeIn(): Action;
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
export interface Chapter { }

export interface CharacterOpt {
    /** Character's display name colour. */
    color?: string;
    /** Character's expressions. */
    expressions?: { [name: string]: string; };
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

    /** Textbox's text color */
    color?: string;

    /** Textbox's text border */
    border?: [number, number, number, number];
}

export interface NameboxOpt {
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
    /** Define a chapter.
     *
     * @example
     * ```js
     * chapter("start", () => [
     *    say("Ohh today is a great day!"),
     * ]);
     * ```
     */
    chapter(
        /** Chapter's title. */
        title: string,
        /** Chapter's action. Will be runned while the current chapter is this */
        actions: () => Action[]
    ): void;

    /** Define a character.
     *
     * @example
     * ```js
     * character("b", "Beany");
     * ```
     */
    character(
        /** Identifier to use the character. */
        id: string,
        /** Name of the character. */
        name: string,
        /** Options of character. */
        opt?: CharacterOpt
    ): void;

    /** Write in the textbox.
     *
     * @example
     * ```js
     * // write as narrator
     * say("We all live in a yellow submarine")
     * ```
     */
    say(
        /** Text to say. */
        text: string
    ): Action;

    /** Write in the textbox as character.
     * 
     * @example
     * ```js
     * say("b", "Help! I need somebody...")
     * ```
    */
    say(
        /** The character's id */
        id: string,
        /** Text to say */
        text: string
    ): Action;

    /** Show a character. */
    show(
        character: string,
        expression: string,
        align?: "center" | "left" | "right" | Position
    ): SkippableAction;

    /** Hide a character. */
    hide(character: string): SkippableAction;

    /** Jump to another chapter. */
    jump(
        /** Chapter to jump */
        chapter: string
    ): Action;

    /** Shows a background */
    showBackground(): Action;

    /** Shows a color background (usable for placeholders) */
    showBackgroundColor(
        /** Background's color */
        color: string,
        /** It should fade at start? */
        fade?: boolean,
    ): Action;

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

    /** Show the textbox */
    showTextbox(
        /** Time to show the textbox */
        time: number
    ): Action;

    /** Hide the textbox */
    hideTextbox(
        /** Time to hide the textbox */
        time: number
    ): Action;
}

// Components
export interface TextboxComp extends Comp {
    skipped: boolean;

    curChar: number;

    /** Textbox */
    textbox?: GameObj;

    /** Namebox */
    namebox?: GameObj;

    /** Custom add */
    addEx(): void;

    /** Write a text */
    write(text: string): Promise<void>;

    /** Set the name of namebox */
    setName(text: string, color?: string | number | typeof Color): void;

    /** Skip current writng text */
    skipText(): void;

    /** Show the textbox */
    show(
        /** Time for show the textbox */
        time?: number,
    ): void;

    /** Hide the textbox */
    hide(
        /** Time for show the textbox */
        time?: number,
    ): void;
}

export default kanovel;
