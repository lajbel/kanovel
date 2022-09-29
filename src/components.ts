// Custom Kaboom components used by KaNovel

import { Comp } from "kaboom";

export interface TextboxComp extends Comp {
    /** Write a text */
    write(text: string): void;
    /** Set the name of namebox */
    setName(text: string): void;
}

export function textboxComp(): TextboxComp {
    return {
        id: "textbox",
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
