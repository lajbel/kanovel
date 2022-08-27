// we start importing these modules
import kaboom from "kaboom";
import kanovelPlugin from "../kanovel";
import loadAssets from "./loader";

import { loadMenu } from "./scenes";

// load the kaboom context, the base of all
kaboom({
    width: 800,
    height: 600,
    // load the kanovel plugin 🦋
    plugins: [kanovelPlugin],
    background: [255, 191, 191],
    stretch: true,
    letterbox: true,
    touchToMouse: true,
    debug: false,
});

// load assets and the main menu
loadAssets();
loadMenu();

// kanovel configuration
kanovel({
    textbox: {
        sprite: "textbox",
        padding: [50, 20],
    },
    choice: {
        sprite: "choice",
    },
});

// characters to use in the narration
character("p", "you");
character("b", "beany", "beany");
character("m", "marky", "marky");

// the start of your novel 🚩
chapter("start", () => [
    prota("Ohh today is a great day!"),
    prota("Hmm..."),
    prota("I would like to do something fun."),

    // jump to other chapter
    jump("in the train"),
]);

chapter("in the train", () => [
    bg("train"),
    music("Moar BGM"),

    prota("..."),
    prota("..."),
    char("p", "IT'S A ANIME WORLD???"),

    show("b"),
    char("b", "Yes, you are in a Visual Novel"),

    jump("stranger things"),
]);

chapter("stranger things", () => [
    prota("A beautiful girl just appeared in front of me"),
    char("b", "My eyes are here, generic protagonist"),

    show("m", "left"),
    char("m", "ohhi"),

    char("m", "welcome to KaNovel"),
    char("m", "do you like this visual novel?"),

    choice(
        ["Yes", char("m", "ohh... so good!")],
        ["No", char("m", "ohh... so bad!")]
    ),

    char("m", "now it's your turn to make your own story"),

    end("menu", "kanoveldefaultend", { withBurp: true }),
]);
