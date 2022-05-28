// The start of all KaNovel games

import kaboom from "kaboom";
import kanovelPlugin from "./kanovel";
import loadAssets from "./loader";
import loadMenu from "./menu"

kaboom({
	width: 800,
	height: 600,
	plugins: [ kanovelPlugin ],
	// This is a default background, for change the game bg, use bg()
	background: [ 255, 209, 253 ],
	stretch: true,
	letterbox: true,
});

// kanovel({
// 	textboxSprite: "textbox"
// });

loadAssets();
loadMenu();

// Characters for use in the narration

character("p", "A Replit User (YOU)");
character("b", "Beany", "beany");

// The "start" chapter for your novel 🚩

chapter("start", () => [
	prota("Ohh today is a great day!"),
	prota("Hmm. I want to ..."),
	prota("I want to live a fun life!"),
	prota("..."), 
	bg("train"),
	prota("..."),
	char("p", "IT'S A ANIME WORLD???"),
	show("b"),
	char("b", "Yes, you are in a Visual Novel"),
	jump("stranger things"),
]);

chapter("stranger things", () => [
	prota("A beautiful girl just appeared in front of me"),
	char("b", "My eyes are here, generic protagonist"),
]);

// Go to menu scene
go("menu");