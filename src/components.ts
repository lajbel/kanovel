import { Comp, GameObj, TextComp } from "kaboom";
import "kaboom/global";

// fade component
export function fade(startFade?: "in" | "out", startFadeTime?: number) {
    return {
        id: "fade",
        add() {
            switch (startFade) {
                case "in":
                    this.fadeIn(startFadeTime ?? 1);
                    break;
                case "out":
                    this.fadeOut(startFadeTime ?? 1);
                    break;
                default:
                    break;
            }
        },

        fadeIn(time: number = 1) {
            tween(this.opacity ?? 0, 1, time, (val) => { this.opacity = val; }, easings.linear);
        },

        fadeOut(time: number = 1) {
            tween(this.opacity ?? 1, 0, time, (val) => { this.opacity = val; }, easings.linear);
        },
    };
}

