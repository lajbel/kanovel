import { GameObj, PosComp, AnchorComp } from "kaboom";
import { textboxc, TextboxComp } from "./components";
import { TextboxOpt } from "./types";
import { array2Vec2 } from "./util";

import "kaboom/global";

export function addTextbox(
    opt: TextboxOpt = {}
): GameObj<PosComp | AnchorComp | TextboxComp> {
    const conf = {
        pos: array2Vec2(opt.pos ?? [0, height()]),
        width: opt.width ?? width(),
        height: opt.height ?? 200,
        sprite: opt.sprite ?? null,
        size: opt.size ?? 42,
        font: opt.font ?? "Sans-Serif",
        border: opt.border ?? [10, 0, 0, 10],
    };

    const textbox = add([pos(conf.pos), anchor("botleft"), textboxc(), z(9999)]);

    textbox.add([
        pos(center().x, 0),
        z(0),
        conf.sprite ? sprite(conf.sprite) : rect(conf.width, conf.height),
        anchor("bot"),
        "background",
    ]);

    textbox.add([
        pos(0 + conf.border[3], -conf.height + conf.border[0]),
        z(1),
        anchor("topleft"),
        text("", { size: conf.size, font: opt.font, width: width() + conf.border[1] }),
        color(BLACK),
        "textbox",
    ]);

    textbox.add([
        z(1),
        pos(0, -conf.height - 2),
        anchor("botleft"),
        text("", { size: 82 }),
        "namebox",
    ]);

    textbox.addEx();

    return textbox;
}
