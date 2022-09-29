import { TextboxOpt } from "./types";

// TODO: update to childrens when new kaboom
export function addTextbox(
    opt: TextboxOpt = {
        width: width(),
    }
) {
    const textbox = add([
        pos(0, height()),
        // @ts-ignore
        origin("botleft"),
    ]);

    textbox.bg = add([
        pos(),
        follow(textbox),
        // @ts-ignore
        origin("botleft"),
        rect(opt.width!, 200),
    ]);

	textbox.text = add([
		pos(),
		follow(textbox, vec2(0, 200 )),
		text(""),
	]);
}

/** 
function addTextbox(conf?: TextboxOpt, nbConf?: NameboxOpt) {
        const textboxWidth = conf?.width || k.width();
        const textboxHeight = conf?.height || k.height() / 4;
        const textboxPadding = conf?.padding!
            ? array2Vec2(conf?.padding)
            : k.vec2(20, 20);
        const maxTextSize =
            conf?.text?.maxWidth || textboxWidth - textboxWidth / 6;
        const fontText = conf?.text?.font || "apl386o";

        // textbox
        const textboxBG = k.add([
            conf?.sprite
                ? k.sprite(conf.sprite)
                : k.rect(textboxWidth, textboxHeight),
            k.origin("bot"),
            k.z(layers.textbox),
            k.pos(
                conf?.pos
                    ? array2Vec2(conf.pos)
                    : k.vec2(k.width() / 2, k.height() - 20)
            ),
        ]);

        // text
        this.textbox = k.add([
            k.text("", {
                size: conf?.size! | 30,
                width: maxTextSize,
                font: fontText,
            }),
            k.pos(
                textboxBG.pos.sub(
                    textboxBG.width / 2 - textboxPadding.x,
                    textboxBG.height - textboxPadding.y
                )
            ),
            k.z(layers.text),
        ]);

        // namebox
        this.namebox = k.add([
            nbConf?.sprite ? k.sprite(nbConf.sprite) : null,
            k.text("", { size: 40 }),
            k.pos(
                textboxBG.pos.sub(
                    textboxBG.width / 2 - 30,
                    textboxBG.height + 30
                )
            ),
            k.z(layers.name),
        ]);
    }
*/
