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

    /** Write a text */
    write(text: string): Promise<void>;
    /** Set the name of namebox */
    setName(text: string): void;
    /** Skip current writing text */
    skipText(): void;
}

export function textboxc(): TextboxComp {
    let textbox: GameObj<TextComp>;
    let namebox: GameObj<TextComp>;

    return {
        id: "kn_textbox",
        require: [],

        curChar: 0,
        skipped: false,

        add() {
            textbox = this.get("textbox")[0];
            namebox = this.get("namebox")[0];
        },

        write(txt: string) {
            return new Promise((resolve) => {
                textbox.text = "";

                const stopWriting = loop(0.05, () => {
                    if (this.skipped) {
                        this.skipped = false;

                        textbox.text = txt;

                        this.curChar = 0;

                        resolve();

                        return stopWriting();
                    }

                    textbox.text += txt[this.curChar];
                    this.curChar++;

                    if (this.curChar == txt.length) {
                        this.curChar = 0;
                        resolve();
                        return stopWriting();
                    }
                });
            });
        },
        setName(txt: string) {
            namebox.text = txt;
        },
        skipText() {
            if (!this.skipped) this.skipped = true;
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
            const cancelFadeIn = onUpdate(() => {
                if (this.opacity > 1) return cancelFadeIn();

                timer += dt();

                this.opacity = map(timer, 0, time, 0, 1);
            });
        },

        fadeOut() {
            this.use(lifespan(1, { fade: 1 }));
        },
    };
}
