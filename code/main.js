// The start of all KaNovel games

import kaboom from "kaboom";
import kanovelPlugin from "./kanovel";
import loadAssets from "./loader";
import loadMenu from "./menu";
import loadEnd from "./end";

kaboom({
	width: 800,
	height: 600,
	plugins: [ kanovelPlugin ],
	// This is a default background, for change the game bg, use bg()
	background: [ 255, 209, 253 ],
	stretch: true,
	letterbox: true,
});

kanovel({
	textbox: {
		sprite: "textbox",
	}
});

loadAssets();
loadMenu();
loadEnd();

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

	jump("stranger things")
]);

chapter("stranger things", () => [
	prota("A beautiful girl just appeared in front of me"),
	char("b", "My eyes are here, generic protagonist"),

	show("m", "left"),
	char("m", "ohhi"),
	char("m", "welcome to KaNovel"),
	char("m", "now it's your turn to make your own story"),

	burpy(),
]);

// Go to menu scene
go("menu");