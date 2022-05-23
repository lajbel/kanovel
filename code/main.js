 // The start of all KaNovel games

import kaboom from "kaboom";
import kanovelPlugin from "../kanovel";
import loadAssets from "./loader";
import loadMenu from "./menu"

export default kaboom({
	width: 800,
	height: 600,
	plugins: [ kanovelPlugin ],
	background: [ 255, 209, 253 ], // This is a default background, for change the game bg, use bg()
	stretch: true,
	letterbox: true,
});

// kanovel({
// 	textboxSprite: "textbox"
// });

loadAssets();
loadMenu();

// Define your characters

character("b", "Beany", "beany");

// The start chapter

chapter("start", () => [
	prota("Ohh today is a great day!"),
	prota("Hmm. I want to ..."),
	prota("I want to live a visual novel life!"),
	// two actions in the same time
	[
		prota(". . ."), 
		bg("train"),
	],
	prota("what"),
	[
		prota("IT'S A ANIME WORLD"),
	],
	[
		show("b"),
		char("b", "Yes, you are in a Visual Novel"),
	],
	jump("stranger things"),
]);

chapter("stranger things", () => [
	prota("A beautiful girl just appeared in front of me!"),
	char("b", "My eyes are here, generic protagonist"),
	prota("A beautiful girl just appeared in front of me!"),
]);

// Go to menu scene
go("menu");