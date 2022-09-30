import { GameObj } from "kaboom";
import { textboxComp, TextboxComp } from "./components";
import { TextboxOpt } from "./types";
import { array2Vec2 } from "./util";

// TODO: update to childrens when new kaboom
export function addTextbox(opt: TextboxOpt = {}): GameObj<TextboxComp> {
    const conf = {
        pos: array2Vec2(opt.pos ?? [0, height()]),
        width: opt.width ?? width(),
        height: opt.height ?? 200,
        sprite: opt.sprite ?? null,
        border: opt.border ?? [10, 0, 0, 10],
    };

    const textbox = add([
        pos(conf.pos),
        // @ts-ignore
        origin("botleft"),
        textboxComp(),
    ]);

    textbox.bg = add([
        pos(),
        follow(textbox),
        // @ts-ignore
        origin("botleft"),
        conf.sprite ? sprite(conf.sprite) : rect(conf.width, conf.height),
    ]);

    textbox.textBox = add([
        pos(),
        follow(textbox, vec2(0 + conf.border[3], -conf.height)),
        text("", { size: 42, width: width() - conf.border[1] }),
    ]);

    textbox.nameBox = add([
        pos(),
        follow(textbox, vec2(0, -conf.height - 2)),
        // @ts-ignore
        origin("botleft"),
        text("", { size: 82 }),
    ]);

    return textbox as GameObj<TextboxComp>;
}
