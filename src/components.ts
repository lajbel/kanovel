import { Comp, GameObj, TextComp } from "kaboom";
import "kaboom/global";

// textbox component
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
    show(): void;
    /** Hide the textbox */
    hide(): void;
}

export function textboxc(): TextboxComp {
    let textbox: GameObj<TextComp>;
    let namebox: GameObj<TextComp>;

    return {
        id: "kn_textbox",
        require: [],

        curChar: 0,
        skipped: false,

        addEx() {
            textbox = this.get("textbox")[0];
            namebox = this.get("namebox")[0];
        },

        write(txt: string) {
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
        show() {
            this.use(fade("in"));
        },
        hide() {
            this.use(fade("out"));
        },
    };
}

// fade component
export function fade(startFade?: "in" | "out") {
    let timer = 0;

    return {
        id: "fade",
        add() {
            switch (startFade) {
                case "in":
                    this.fadeIn();
                    break;
                case "out":
                    this.fadeOut();
                    break;
                default:
                    break;
            }
        },

        fadeIn(time: number = 1) {
            tween(this.opacity, 1, time, (val) => (this.opacity = val), easings.linear);
        },

        fadeOut(time: number = 1) {
            tween(this.opacity, 0, time, (val) => (this.opacity = val), easings.linear);
        },
    };
}
