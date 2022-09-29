import { GameObj } from "kaboom";
import { TextboxOpt } from "./types";
import { array2Vec2 } from "./util";

interface TextboxGameObj extends GameObj {
    /** Write a text */
    write(text: string): void;
    /** Set the name of namebox */
    setName(text: string): void;
}

// TODO: update to childrens when new kaboom
export function addTextbox(opt: TextboxOpt = {}): TextboxGameObj {
    const conf = {
        pos: array2Vec2(opt.pos ?? [0, height()]),
        width: opt.width ?? width(),
        height: opt.height ?? 200,
    };

    const textbox = add([
        pos(conf.pos),
        // @ts-ignore
        origin("botleft"),
        {
            async write(txt: string) {
                this.textBox.text = "";

                for (let i = 0; i < txt.length; i++) {
                    await wait(0.05);

                    this.textBox.text += txt[i];
                }
            },

            setName(txt: string) {
                this.nameBox.text = txt;
            },
        },
    ]);

    textbox.bg = add([
        pos(),
        follow(textbox),
        // @ts-ignore
        origin("botleft"),
        rect(conf.width, 200),
    ]);

    textbox.textBox = add([
        pos(),
        follow(textbox, vec2(0, -conf.height)),
        text(""),
    ]);

    textbox.nameBox = add([
        pos(),
        follow(textbox, vec2(0, -conf.height - 30)),
        text("", { size: 40 }),
    ]);

    return textbox as TextboxGameObj;
}
