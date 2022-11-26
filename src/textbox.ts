import { GameObj, PosComp, AnchorComp, KaboomCtx } from "kaboom";
import { textboxc, TextboxComp } from "./components";
import { NameboxOpt, TextboxOpt } from "./types";
import { array2Vec2 } from "./util";

import "kaboom/global";

// TODO: Change tags to irregular names
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
    // TODO: should be the sprite loaded?
    let textboxHeight = conf.sprite ? k.getSprite(conf.sprite)!.data?.tex.height! : conf.height;
    let textboxWidth = conf.sprite ? k.getSprite(conf.sprite)!.data?.tex.width! : conf.width;

    let defaultTextboxMaxWidth = k.width() - (k.width() - textboxWidth);

    // default textbox parent for order position
    const textbox = k.add([
        k.pos(conf.pos ?? k.vec2(k.center().x, k.height() - textboxHeight / 2)),
        k.z(999),
        k.anchor("center"),
        textboxc(),
    ]);

    // the textbox background
    textbox.add([
        k.pos(0, 0),
        k.z(0),
        k.anchor("center"),
        conf.sprite
            ? k.sprite(conf.sprite)
            : k.rect(conf.width, conf.height),
        "background",
    ]);

    // textbox text
    // TODO: update borders to be more code style understable
    textbox.add([
        k.pos(
            0 - textboxWidth / 2 + conf.border[3],
            0 - textboxHeight / 2 + conf.border[0]
        ),
        k.z(1),
        k.anchor("topleft"),
        k.text("", { size: conf.size, font: opt.font, width: defaultTextboxMaxWidth }),
        k.color(conf.color),
        "textbox",
    ]);

    // namebox text
    // TODO: add support to namebox background
    textbox.add([
        pos(
            0 - textboxWidth / 2 + nbConf.border[3],
            0 - textboxHeight / 2 + nbConf.border[0]
        ),
        z(1),
        anchor("botleft"),
        text("", { size: nbConf.size, }),
        "namebox",
    ]);

    textbox.addEx();

    return textbox;
}
