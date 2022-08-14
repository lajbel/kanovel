/**
 * @callback onUpdate - What to run every time the tween updates.
 * @param {number} frame
 * @param {number} second
 * @param {number} percent
 * @param {number} easePercent
 * @param {number} value
 */
/**
 * @callback onFinish - What to run when the tween ends.
 * @param {Object} time - The properties that defined how to animate this object.
 * @param {Object} config - The properties that defined how to style this animation.
 * @param {number} [loops] - How many times the tween has looped.
 */
export function KBTween(k) {
    const tweentypes = {
        NORMAL: 0,
        FOREVER: 2,
        CONTINUE: 4,
        PINGPONG: 8,
        __NOOP: (x) => {
            return x;
        },
    };
    /**
     * @function tween
     * Creates a tween to animate properties of an object.
     * @param {string} object - The object with the properties being animated.
     * @param {string[]} prop - The properties that will be animated.
     * @param {Object} time - The properties that define how to animate the object.
     * @param {number} time.from - The initial value to animate from.
     * @param {number} time.to - The new value to animate to.
     * @param {number} time.time - The time it takes to animate the object.
     * @param {number} [time.type] - Defines how the animation works.
     * @param {Object} [config] - The properties that define how to style the animation.
     * @param {Function} [config.ease] - The ease and smoothness of the animation.
     * @param {Function} [config.onStart] - What to run when the tween starts.
     * @param {onUpdate} [config.onUpdate] - What to run every time the tween updates.
     * @param {onFinish} [config.onFinish] - What to run when the tween ends.
     * @returns {Function} - End the tween manually.
     */
    const tween = (object, prop, time, config) => {
        time.type = time.type ?? 0;
        var config = config ?? {};
        config.ease = config.ease ?? tweentypes.__NOOP;
        config.onStart = config.onStart ?? tweentypes.__NOOP;
        config.onUpdate = config.onUpdate ?? tweentypes.__NOOP;
        config.onFinish = config.onFinish ?? tweentypes.__NOOP;

        var frame = 0;
        var startTime = k.time();
        var loops = 0;
        config.onStart();
        var updateFunc = k.onUpdate(() => {
            var curTime = k.time() - startTime;
            var curPercent = curTime / time.time;
            for (let i in prop) {
                object[prop[i]] = k.lerp(
                    time.from,
                    time.to,
                    config.ease(curPercent)
                );
            }
            if (curPercent >= 1) {
                switch (time.type) {
                    case 0:
                        for (let i in prop) {
                            object[prop[i]] = time.to;
                        }
                        updateFunc();
                        break;
                    case 2:
                        startTime = k.time();
                        break;
                    case 4:
                        break;
                    case 8:
                        var x = time.from;
                        time.from = time.to;
                        time.to = x;
                        startTime = k.time();
                        break;
                }
                loops++;
                config.onFinish(time, config, loops);
            }
            config.onUpdate(
                frame,
                curTime,
                curPercent,
                config.ease(curPercent),
                k.lerp(time.from, time.to, config.ease(curPercent))
            );
            frame++;
        });
        return (clean) => {
            if (!clean) {
                for (let i in prop) {
                    object[prop[i]] = time.to;
                }
            }
            time.type = 0;
            updateFunc();
        };
    };
    return {
        tweentypes: tweentypes,
        tween: tween,
    };
}

export var easings = {
    // Easings taken from https://easings.net/
    linear: (x) => {
        return x;
    },
    easeInSine: (x) => {
        return 1 - Math.cos((x * Math.PI) / 2);
    },
    easeOutSine: (x) => {
        return Math.sin((x * Math.PI) / 2);
    },
    easeInOutSine: (x) => {
        return -(Math.cos(Math.PI * x) - 1) / 2;
    },
    easeInQuad: (x) => {
        return x * x;
    },
    easeOutQuad: (x) => {
        return 1 - (1 - x) * (1 - x);
    },
    easeInOutQuad: (x) => {
        return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
    },
    easeInCubic: (x) => {
        return x * x * x;
    },
    easeOutCubic: (x) => {
        return 1 - Math.pow(1 - x, 3);
    },
    easeInOutCubic: (x) => {
        return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    },
    easeInQuart: (x) => {
        return x * x * x * x;
    },
    easeOutQuart: (x) => {
        return 1 - Math.pow(1 - x, 4);
    },
    easeInOutQuart: (x) => {
        return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
    },
    easeInQuint: (x) => {
        return x * x * x * x * x;
    },
    easeOutQuint: (x) => {
        return 1 - Math.pow(1 - x, 5);
    },
    easeInOutQuint: (x) => {
        return x < 0.5
            ? 16 * x * x * x * x * x
            : 1 - Math.pow(-2 * x + 2, 5) / 2;
    },
    easeInExpo: (x) => {
        return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
    },
    easeOutExpo: (x) => {
        return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    },
    easeInOutExpo: (x) => {
        return x === 0
            ? 0
            : x === 1
            ? 1
            : x < 0.5
            ? Math.pow(2, 20 * x - 10) / 2
            : (2 - Math.pow(2, -20 * x + 10)) / 2;
    },
    easeInCirc: (x) => {
        return 1 - Math.sqrt(1 - Math.pow(x, 2));
    },
    easeOutCirc: (x) => {
        return Math.sqrt(1 - Math.pow(x - 1, 2));
    },
    easeInOutCirc: (x) => {
        return x < 0.5
            ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
            : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
    },
    easeInBack: (x) => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return c3 * x * x * x - c1 * x * x;
    },
    easeOutBack: (x) => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    },
    easeInOutBack: (x) => {
        const c1 = 1.70158;
        const c2 = c1 * 1.525;
        return x < 0.5
            ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
            : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
    },
    easeInBounce: (x) => {
        return 1 - easings.easeOutBounce(1 - x);
    },
    easeOutBounce: (x) => {
        const n1 = 7.5625;
        const d1 = 2.75;

        if (x < 1 / d1) {
            return n1 * x * x;
        } else if (x < 2 / d1) {
            return n1 * (x -= 1.5 / d1) * x + 0.75;
        } else if (x < 2.5 / d1) {
            return n1 * (x -= 2.25 / d1) * x + 0.9375;
        } else {
            return n1 * (x -= 2.625 / d1) * x + 0.984375;
        }
    },
    easeInOutBounce: (x) => {
        return x < 0.5
            ? (1 - easings.easeOutBounce(1 - 2 * x)) / 2
            : (1 + easings.easeOutBounce(2 * x - 1)) / 2;
    },
};
