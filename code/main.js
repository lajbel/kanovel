// The start of all KaNovel games

import kaboom from "kaboom";
import kanovelPlugin from "../kanovel";
import loadAssets from "./loader";

import { loadMenu } from "./scenes";

kaboom({
    width: 800,
    height: 600,
    plugins: [kanovelPlugin],
    // This is a default background, for change the game bg, use bg()
    background: [255, 209, 253],
    stretch: true,
    letterbox: true,
    debug: false,
});

// Load assets and main menu
loadAssets();
loadMenu();

// Novel configuration
kanovel({
    textbox: {
        sprite: "textbox",
        padding: [50, 20], // the padding of the text of the texbox
    },
    choice: {
        sprite: "choice",
    },
});

// Characters for use in the narration
character("p", "A Replit User (YOU)");
character("b", "Beany", "beany");
character("m", "Marky", "marky");

// The "start" chapter for your novel 🚩
chapter("start", () => [
    prota("Ohh today is a great day!"),
    prota("Hmm..."),
    prota("I would like to do something fun."),

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
