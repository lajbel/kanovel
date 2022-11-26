import { GameObj, Comp, PosComp, TextComp, AnchorComp, KaboomCtx } from "kaboom";
import { NameboxOpt, TextboxOpt } from "./types";
import { fade } from "./components";
import { array2Vec2 } from "./util";

import "kaboom/global";

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

export function textbox(): TextboxComp {
    let textbox: GameObj<TextComp>;
    let namebox: GameObj<TextComp>;

    return {
        id: "kn_tb_comp",
        require: [],

        curChar: 0,
        skipped: false,

        addEx() {
            textbox = this.get("kn_tb_textbox")[0];
            namebox = this.get("kn_tb_namebox")[0];
        },

        write(txt: string) {
            //TODO: wait some miliseconds with , 
            return new Promise((resolve) => {
                textbox.text = "";

                const writing = loop(0.05, () => {
                    if (this.skipped) {
                        this.skipped = false;

                        textbox.text = txt;

                        this.curChar = 0;

                        resolve();

                        return writing();
                    }

                    textbox.text += txt[this.curChar];
                    this.curChar++;

                    if (this.curChar == txt.length) {
                        this.curChar = 0;

                        resolve();

                        return writing();
                    }
                });
            });
        },

        setName(txt, colour?) {
            namebox.text = txt;
            namebox.use(
                color(colour ? Color.fromHex(String(colour)) : rgb(255, 255, 255))
            );
        },

        skipText() {
            if (!this.skipped) this.skipped = true;
        },

        show(this: GameObj, time: number = 1) {
            this.children.forEach(c => {
                c.use(fade("in", time));
            });
        },

        hide(this: GameObj, time: number = 1) {
            this.children.forEach(c => {
                c.use(fade("out", time));
            });
        },
    };
}

export function addTextbox(
    k: KaboomCtx,
    opt: TextboxOpt = {},
    nbOpt: NameboxOpt = {}
): GameObj<PosComp | AnchorComp | TextboxComp> {
    const conf = {
        pos: array2Vec2(opt.pos!),
        width: opt.width ?? k.width(),
        height: opt.height ?? k.height() / 8,
        sprite: opt.sprite ?? null,
        size: opt.size ?? 42,
        font: opt.font ?? "Sans-Serif",
        color: opt.color ? Color.fromHex(opt.color) : BLACK,
        border: opt.border ?? [5, 0, 0, 5],
    };

    const nbConf = {
        border: nbOpt.border ?? [0, 0, 0, 0],
        size: nbOpt.size ?? 82,
    };

    // calculates the default textbox position
    let textboxHeight = conf.sprite ? k.getSprite(conf.sprite)!.data?.tex.height! : conf.height;
    let textboxWidth = conf.sprite ? k.getSprite(conf.sprite)!.data?.tex.width! : conf.width;

    let defaultTextboxMaxWidth = k.width() - (k.width() - textboxWidth);

    // default textbox parent for order position
    const textboxParent = k.add([
        k.pos(conf.pos ?? k.vec2(k.center().x, k.height() - textboxHeight / 2)),
        k.z(999),
        k.anchor("center"),
        textbox(),
    ]);

    // the textbox background
    textboxParent.add([
        k.pos(0, 0),
        k.z(0),
        k.anchor("center"),
        conf.sprite
            ? k.sprite(conf.sprite)
            : k.rect(conf.width, conf.height),
        "kn_tb_background",
    ]);

    // textbox text
    // TODO: update borders to be more code style understable
    textboxParent.add([
        k.pos(
            0 - textboxWidth / 2 + conf.border[3],
            0 - textboxHeight / 2 + conf.border[0]
        ),
        k.z(1),
        k.anchor("topleft"),
        k.text("", { size: conf.size, font: opt.font, width: defaultTextboxMaxWidth }),
        k.color(conf.color),
        "kn_tb_textbox",
    ]);

    // namebox text
    // TODO: add support to namebox background
    textboxParent.add([
        pos(
            0 - textboxWidth / 2 + nbConf.border[3],
            0 - textboxHeight / 2 + nbConf.border[0]
        ),
        z(1),
        anchor("botleft"),
        text("", { size: nbConf.size, }),
        "kn_tb_namebox",
    ]);

    textboxParent.addEx();

    return textboxParent;
}
