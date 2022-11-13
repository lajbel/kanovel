import kaboom, { KaboomCtx, GameObj, AudioPlay } from "kaboom";
import { TextboxComp, fade } from "./components";
import { addTextbox } from "./textbox";
import { download } from "./util";

import type {
    KaNovelPlugin,
    Character,
    Action,
    KaNovelOpt,
    CharacterOpt,
    SkippableAction,
} from "./types";

// kaboom() handler for kanovel
function kanovel(opt: KaNovelOpt = {}) {
    const conf = {
        width: opt.width ?? 1280,
        height: opt.height ?? 720,
        letterbox: opt.letterbox ?? true,
        stretch: opt.stretch ?? true,
        background: opt.background ?? [235, 152, 207],
        plugins: [kanovelPlugin],
    };

    kaboom(conf);
}

// kanovel plugin
export function kanovelPlugin(k: KaboomCtx): KaNovelPlugin {
    const characters = new Map<string, Character>();
    const chapters = new Map<string, Action[]>();
    const audios = new Map<string, AudioPlay>();

    let curChapter = "start";
    let curAction = -1;
    let isAction = false;

    let textbox: GameObj<TextboxComp>;

    // run the next action
    async function nextAction() {
        isAction = true;
        curAction++;

        const action = chapters.get(curChapter)![curAction];

        if (!action) return (isAction = false);

        await action.run();

        isAction = false;

        if (action.autoskip) nextAction();
    }

    // skips the current action
    function skipAction() {
        const action = chapters.get(curChapter)![curAction];

        if (action.skip) action.skip();
    }

    // add a chapter
    function addChapter(title: string, actions: any) {
        if (chapters.get(title))
            throw new Error(`You can't repeat the chapter name! "${title}"`);

        chapters.set(title, actions());
    }

    // change the chapters
    function changeChapter(chapter: string) {
        if (!chapters.get(chapter)) throw new Error(`Chapter not found: ${chapter}`);

        curChapter = chapter;
        curAction = -1;
    }

    // adds an audio in the current audios
    function addAudio(audio: string) {
        let au = k.play(audio);

        audios.set(audio, au);
    }

    // remove an audio from the current audios
    function removeAudio(audio: string) {
        const a = audios.get(audio);

        a?.stop();

        audios.delete(audio);
    }

    // show character
    function showCharacter(
        character: string,
        expression: string,
        align: "left" | "center" | "right"
    ) {
        const ch = characters.get(character);
        if (!ch) throw Error("Character's id not found.");

        const exp = ch.opt.expressions?.[expression];

        if (!exp) throw Error(`Character's expression ${expression} not found.`);

        const alignments = {
            left: [k.anchor("botleft"), k.pos(0, k.height())],
            center: [k.anchor("bot"), k.pos(k.center().x, k.height())],
            right: [k.anchor("botright"), k.pos(k.width(), k.height())],
        };

        k.add([
            k.sprite(exp),
            k.opacity(0),
            ...alignments[align],
            fade("in", 0.4),
            z(100),
            ch.id,
        ]);
    }

    function hideCharacter(character: string) {
        const ch = characters.get(character);

        if (!ch) throw Error("Character's id not found.");

        get(ch.id)[0].destroy();
    }

    // default scene for load kanovel gaems
    k.scene("kanovel", () => {
        // default global volume
        volume(0.5);

        if (!chapters.get("start")) throw Error("Should define a start chapter.");

        textbox = addTextbox();

        nextAction();

        // Default input for Visual Novel
        k.onUpdate(() => {
            if (k.isMousePressed("left") || k.isKeyPressed("space")) {
                if (!isAction) nextAction();
                else skipAction();
            }

            if (k.isKeyPressed("s")) {
                const temp = onDraw(() => {
                    download("screenshot.png", k.screenshot());

                    temp();
                });
            }
        });
    });

    k.onLoad(() => {
        k.go("kanovel");
    });

    return {
        // a creator for chapters
        chapter(title: string, actions: any) {
            addChapter(title, actions);
        },

        // a creator for characters
        character(id: string, name: string, opt: CharacterOpt) {
            characters.set(id, {
                id,
                name,
                opt,
            });
        },

        ///////////////// NARRATION //////////////////////////

        // an action to make speak a character
        say(...args: string[]): Action {
            if (args.length === 2) {
                const char = characters.get(args[0]);

                if (!char) throw Error("Character not found");

                return {
                    id: "say",
                    async run() {
                        textbox.setName(char.name, char.opt?.color!);
                        await textbox.write(args[1]);
                    },
                    skip() {
                        textbox.skipText();
                    },
                };
            } else {
                return {
                    id: "say",
                    async run() {
                        textbox.setName(" ");
                        await textbox.write(args[0]);
                    },
                    skip() {
                        textbox.skipText();
                    },
                };
            }
        },

        show(
            character: string,
            expression: string,
            align: "left" | "center" | "right" = "center"
        ): SkippableAction {
            return {
                id: "show",
                autoskip: true,
                run() {
                    showCharacter(character, expression, align);
                },
                noSkip() {
                    this.autoskip = false;

                    return this;
                },
            };
        },

        hide(character: string): Action {
            return {
                id: "hide",
                run() {
                    hideCharacter(character);
                },
            };
        },

        // Jumps to another chapter
        jump(chapter: string) {
            return {
                id: "jump",
                autoskip: true,
                run() {
                    changeChapter(chapter);
                },
            };
        },

        ///////////////// VISUALS AND ++ //////////////////////////

        // // an action that shows a background image
        // showStage() {},

        showTextbox() {
            return {
                id: "showTextbox",
                run() {
                    textbox.show();
                },
            };
        },

        hideTextbox() {
            return {
                id: "hideTextbox",
                run() {
                    textbox.hide();
                },
            };
        },

        ///////////////// MUSIC & AUDIO //////////////////////////

        // an action that plays background music
        playMusic(song: string): Action {
            return {
                id: "play",
                autoskip: true,
                async run() {
                    addAudio(song);
                },
            };
        },

        // an action that stops a current listening background music
        stopMusic(song: string): Action {
            return {
                id: "stop",
                autoskip: true,
                async run() {
                    removeAudio(song);
                },
            };
        },
    };
}

export default kanovel;
