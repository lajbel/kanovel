// Custom Kaboom components used by KaNovel

import { Comp } from "kaboom";

export interface TextboxComp extends Comp {
    skipped: boolean;
    curChar: number;
    /** Write a text */
    write(text: string): Promise<void>;
    /** Set the name of namebox */
    setName(text: string): void;
    /** Skip current writing text */
    skipText(): void;
}

export function textboxComp(): TextboxComp {
    return {
        id: "textbox",
        require: [],

        curChar: 0,
        skipped: false,

        write(txt: string) {
            return new Promise((resolve) => {
                this.textBox.text = "";

                const stopWriting = loop(0.05, () => {
                    if (this.skipped) {
                        this.skipped = false;

                        this.textBox.text = txt;

                        this.curChar = 0;

                        resolve();

                        return stopWriting();
                    }

                    this.textBox.text += txt[this.curChar];
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
            this.nameBox.text = txt;
        },
        skipText() {
            if (!this.skipped) this.skipped = true;
        },
    };
}

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
