import kanovel from "kanovel";
import "kanovel/global";

kanovel({
    width: 600,
    height: 300,
    textbox: {
        sprite: "textbox",
        size: 14,
        width: 500,
        height: 40,
    },
    namebox: {
        size: 20,
    }
});

loadSprite("tere-neutral", "./sprites/expressions/tere-neutral.png");
loadSprite("textbox", "./sprites/textbox.png");

// Characters
character("t", "Tere", {
    color: "#1f102a",
    expressions: {
        neutral: "tere-neutral",
    },
});

// Chapter one: The start of all
chapter("start", () => [
    showBackgroundColor("#f0dada"),

    show("t", "neutral"),

    say("t", "Hey there! Welcome to this epic and great visual novel engine"),
    say("t", "KaNovel!"),

    say("t", "With KaNovel, you can make... Visual novels!"),

    hide("t"),

    jump("then"),
]);

// Chapter two: Then, a world here
chapter("then", () => [
    say("Visual Novels???"),
    say("t", "Yes! And it's easy")
]);
