import kaboom, { KaboomCtx, GameObj, AudioPlay } from "kaboom";
import { TextboxComp } from "./components";
import { addTextbox } from "./textbox";
import { download } from "./util";

import type {
    KaNovelPlugin,
    Character,
    Action,
    CharacterExpression,
    KaNovelOpt,
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

    // adds an audio in the current audios
    function addAudio(audio: string) {
        let au = play(audio);

        audios.set(audio, au);
    }

    // remove an audio from the current audios
    function removeAudio(audio: string) {
        const a = audios.get(audio);

        a?.stop();

        audios.delete(audio);
    }

    // show character
    function showCharacter(char: string, align: "left" | "center" | "right") {

    }

    // default scene for load kanovel gaems
    k.scene("kanovel", () => {
        // global volume
        volume(0.5);

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

            k.debug.log(`${isAction ? "on action" : "none"}`);
        });
    });

    k.onLoad(() => {
        go("kanovel");
    });

    // TODO: Remove ts-ignore
    // @ts-ignore
    return {
        // a creator for chapters
        chapter(title: string, actions: any) {
            if (chapters.get(title))
                throw new Error(
                    `You can't repeat the chapter name! "${title}"`
                );

            chapters.set(title, actions());
        },

        // a creator for characters
        character(
            id: string,
            name: string,
            sprite: string,
            expressions?: CharacterExpression[]
        ) {
            characters.set(id, {
                id,
                name,
                sprite,
                expressions: expressions!,
            });
        },

        ///////////////// NARRATION //////////////////////////

        // an action to make speak a character
        say(id: string, text: string): Action {
            if (id && text) {
                const char = characters.get(id);

                if (!char) throw Error("Character not found");

                return {
                    id: "say",
                    async run() {
                        textbox.setName(char.name);
                        await textbox.write(text);
                    },
                    skip() {
                        textbox.skipText();
                    },
                };
            } else {
                return {
                    id: "say",
                    async run() {
                        await textbox.write(id);
                    },
                    skip() {
                        textbox.skipText();
                    },
                };
            }
        },

        show(): Action {
            return {
                id: "show",
                run() {},
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

// // KaNovel Plugin function
// export function kanovelPlugin(k: KaboomCtx): KaNovelPlugin {
//     let config: KaNovelPluginOpt;

//     const characters = new Map<string, Character>();
//     let chapters = new Map();
//     const base_chapters = new Map();
//     const curPlaying = new Map();

//     let curDialog = "";
//     let curChapter = "start";
//     let curEvent = 0;

//     let skip = false;

//     const layers = {
//         bg: 0,
//         chars: 1,
//         textbox: 2,
//         text: 3,
//         name: 4,
//         choices: 5,
//     };

//     function addTextbox(conf?: TextboxOpt, nbConf?: NameboxOpt) {
//         const textboxWidth = conf?.width || k.width();
//         const textboxHeight = conf?.height || k.height() / 4;
//         const textboxPadding = conf?.padding!
//             ? array2Vec2(conf?.padding)
//             : k.vec2(20, 20);
//         const maxTextSize =
//             conf?.text?.maxWidth || textboxWidth - textboxWidth / 6;
//         const fontText = conf?.text?.font || "apl386o";

//         // textbox
//         const textboxBG = k.add([
//             conf?.sprite
//                 ? k.sprite(conf.sprite)
//                 : k.rect(textboxWidth, textboxHeight),
//             k.origin("bot"),
//             k.z(layers.textbox),
//             k.pos(
//                 conf?.pos
//                     ? array2Vec2(conf.pos)
//                     : k.vec2(k.width() / 2, k.height() - 20)
//             ),
//         ]);

//         // text
//         this.textbox = k.add([
//             k.text("", {
//                 size: conf?.size! | 30,
//                 width: maxTextSize,
//                 font: fontText,
//             }),
//             k.pos(
//                 textboxBG.pos.sub(
//                     textboxBG.width / 2 - textboxPadding.x,
//                     textboxBG.height - textboxPadding.y
//                 )
//             ),
//             k.z(layers.text),
//         ]);

//         // namebox
//         this.namebox = k.add([
//             nbConf?.sprite ? k.sprite(nbConf.sprite) : null,
//             k.text("", { size: 40 }),
//             k.pos(
//                 textboxBG.pos.sub(
//                     textboxBG.width / 2 - 30,
//                     textboxBG.height + 30
//                 )
//             ),
//             k.z(layers.name),
//         ]);
//     }

//     async function write(dialog: string, character?: Character) {
//         skip = false;
//         this.textbox.text = "";

//         if (character) {
//             this.namebox.text = character.name;
//             curDialog = '"' + dialog + '"';
//         } else {
//             this.namebox.text = "";
//             curDialog = dialog;
//         }

//         for (let i = 0; i < curDialog.length; i++) {
//             if (skip) break;

//             await k.wait(0.05, () => {
//                 if (skip) return;

//                 this.textbox.text += curDialog[i];
//             });
//         }
//     }

//     function skipText() {
//         skip = true;

//         this.textbox.text = curDialog;
//     }

//     async function addChoices(choices: any, opt: ChoiceOpt) {
//         return new Promise((resolve, reject) => {
//             const basePos = k.vec2(k.width() / 2, k.height() / 4);
//             let lastChoice: GameObj | undefined;

//             for (let i = 0; i < choices.length; i++) {
//                 lastChoice = k.add([
//                     opt?.sprite
//                         ? k.sprite(opt.sprite)
//                         : k.rect(k.width() - 40, k.height() / 8),
//                     k.origin("center"),
//                     k.pos(
//                         lastChoice
//                             ? lastChoice.pos.add(0, basePos.y)
//                             : basePos.clone()
//                     ),
//                     k.z(layers.choices),
//                     k.area(),

//                     fade("in"),

//                     "choice",
//                     {
//                         choice: i,
//                         clicked: false,
//                     },
//                 ]);

//                 k.add([
//                     k.text(choices[i][0]),
//                     k.origin("center"),
//                     k.pos(lastChoice.pos.clone()),
//                     k.z(layers.choices),

//                     fade("in"),

//                     "choiceText",
//                 ]);
//             }

//             onClick("choice", (c) => {
//                 c.clicked = true;

//                 k.every("choice", k.destroy);
//                 k.every("choiceText", k.destroy);

//                 resolve({});

//                 checkChoice(choices[c.choice]);
//             });
//         });
//     }

//     function checkChoice(choice) {
//         insertInArray(chapters.get(curChapter), curEvent, choice[1]);
//     }

//     function showCharacter(
//         char: Character,
//         align: "center" | "left" | "right" | Position = "center",
//         expression?: string
//     ) {
//         const showIt =
//             char.expressions.find((e) => e.name === expression)?.sprite ||
//             char.sprite;
//         let charPos: Vec2 = k.vec2(0, 0);

//         if (align === "center") charPos = k.center();
//         else if (align === "left")
//             charPos = k.vec2(k.width() / 4, k.height() / 2);
//         else if (align === "right")
//             charPos = k.vec2(k.width() / 2 + k.width() / 4, k.height() / 2);
//         else if (align) charPos = array2Vec2(align);

//         // remove if already that char exists
//         if (get(char.name)[0]) get(char.name)[0].fadeOut();

//         k.add([
//             k.sprite(showIt),
//             k.opacity(0),
//             k.origin("center"),
//             k.pos(charPos),
//             k.z(layers.chars),
//             char.name,

//             fade("in"),
//         ]);
//     }

//     function hideCharacter(char: Character) {
//         k.get(char.name).forEach((c) => {
//             c.fadeOut();
//         });
//     }

//     function changeBackground(spr: string) {
//         k.every("bg", (bg) => {
//             bg.use(k.lifespan(1, { fade: 0.5 }));
//         });

//         k.add([
//             k.sprite(spr),
//             k.opacity(0),
//             k.origin("center"),
//             k.pos(k.center()),
//             k.z(layers.bg),
//             "bg",

//             fade("in"),
//         ]);
//     }

//     function changeChapter(chapter: string) {
//         if (!chapters.get(chapter))
//             throw new Error(`"${chapter} chapter don't exists!"`);

//         curChapter = chapter;
//         curEvent = -1;
//     }

//     function loadChapter(title: string, events: any) {
//         if (chapters.get(title))
//             throw new Error(`You can't repeat the chapter name! "${title}"`);

//         chapters.set(title, events());
//         base_chapters.set(title, events());
//     }

//     function playBGMusic(song: string, volume: number = 60) {
//         const bgm = k.play(song, { loop: true, volume: volume / 100 });

//         curPlaying.set(bgm, bgm);
//     }

//     function stopMusic(id?: string) {
//         if (id) {
//             curPlaying.get(id)?.stop();
//         } else {
//             curPlaying.forEach((id, audio) => {
//                 audio.stop();
//             });
//         }
//     }

//     function nextEvent() {
//         if (k.get("choice").length > 0) return;
//         if (this.textbox.text !== curDialog) return skipText();

//         runEvent(
//             chapters.get(curChapter)[curEvent],
//             chapters.get(curChapter)[curEvent + 1]
//         );
//     }

//     async function runEvent(event: any, next?: any) {
//         if (event.length) {
//             for (const e of event)
//                 runEvent(e, chapters.get(curChapter)[curEvent + 1]);
//         } else {
//             await event.exe();

//             curEvent++;

//             if (event.skip) nextEvent();
//         }
//     }

//     function restartNovelValues() {
//         curDialog = "";
//         curChapter = "start";
//         curEvent = 0;
//         this.curPlaying = new Map();

//         chapters = this.base_chapters;
//     }

//     // KaNovel default scene
//     k.onLoad(() => {
//         k.scene(config?.scene || "vn", (data) => {
//             if (config?.textbox) addTextbox(config.textbox);
//             else addTextbox();

//             k.onLoad(nextEvent);

//             // Default input for Visual Novel
//             k.onUpdate(() => {
//                 if (k.isMousePressed() || k.isKeyPressed("space")) {
//                     nextEvent();
//                 }
//             });

//             k.onKeyPress("s", () => {
//                 download("screenshot.png", k.screenshot());
//             });
//         });

//         k.scene("kanoveldefaultend", (toGo: string) => {
//             k.add([k.rect(k.width(), k.height()), k.color(0, 0, 0)]);

//             add([k.text("The End"), k.origin("center"), k.pos(k.center())]);

//             if (toGo) k.onClick(() => go(toGo));
//         });
//     });

//     return {
//         // Visual Novel Making Functions
//         character(
//             id: string,
//             name: string,
//             sprite: string,
//             expressions?: CharacterExpression[]
//         ) {
//             characters.set(id, {
//                 name: name,
//                 sprite: sprite,
//                 expressions: expressions || [],
//             });
//         },

//         chapter(title: string, events: any) {
//             loadChapter(title, events);
//         },

//         // History making functions
//         prota(dialog: string) {
//             return {
//                 id: "prota",
//                 exe: () => write(dialog),
//             };
//         },

//         narrator(dialog: string) {
//             return {
//                 id: "narrator",
//                 exe: () => write(dialog),
//             };
//         },

//         char(id: string, dialog: string) {
//             return {
//                 id: "dialog",
//                 exe: () => write(dialog, characters.get(id)),
//             };
//         },

//         // Display
//         show(
//             charId: string,
//             align: "center" | "left" | "right" = "center",
//             expression?: string
//         ) {
//             return {
//                 id: "show",
//                 exe: () =>
//                     showCharacter(characters.get(charId)!, align, expression),
//                 skip: true,
//             };
//         },

//         hide(charId: string) {
//             return {
//                 id: "hide",
//                 exe: () => hideCharacter(characters.get(charId)!),
//                 skip: true,
//             };
//         },

//         choice(...choices) {
//             return {
//                 id: "choice",
//                 exe: () =>
//                     addChoices(choices, config.choice ? config.choice : {}),
//             };
//         },

//         bg(sprite: string) {
//             return {
//                 id: "bg",
//                 exe: () => changeBackground(sprite),
//                 skip: true,
//             };
//         },

//         jump(chapter: string) {
//             return {
//                 id: "jump",
//                 exe: () => changeChapter(chapter),
//                 skip: true,
//             };
//         },

//         music(song: string, volume: number) {
//             return {
//                 id: "music",
//                 exe: () => playBGMusic(song, volume),
//                 skip: true,
//             };
//         },

//         stop_music(id?: string) {
//             return {
//                 id: "stop",
//                 exe: () => stopMusic(id),
//                 skip: true,
//             };
//         },

//         // end
//         end(
//             toGo: string,
//             endScene: string = "kanoveldefaultend",
//             opt?: { withBurp: boolean }
//         ) {
//             return {
//                 id: "end",
//                 exe: () => {
//                     stopMusic();

//                     if (opt?.withBurp) k.burp();

//                     restartNovelValues();

//                     k.go(endScene, toGo);
//                 },
//             };
//         },

//         burpy(toGo: string = "", endScene: string = "kanoveldefaultend") {
//             return {
//                 id: "burpy",
//                 exe: () => {
//                     stopMusic();

//                     k.burp();

//                     restartNovelValues();

//                     k.go(endScene, toGo);
//                 },
//             };
//         },
//     };
// }

// export default kanovel;
