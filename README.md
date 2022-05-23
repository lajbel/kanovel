KaNovel is a [Replit Template](https://replit.com) for make visuals novels in your browser, using Replit and Kaboom!

Originally made for [Template jam 2022](https://blog.replit.com/template-jam)

## Quick Example
```js 
// We start importing Kaboom and Kanovel plugin
import kaboom from "kaboom";
import kanovelPlugin from "../kanovel";

// Starts the Kaboom context
export default kaboom({
	width: 800,
	height: 600,
	plugins: [ kanovelPlugin ], // IMPORTANT: Load the KaNovel plugin
});

// Define your characters with id, name and sprite
character("b", "Beany", "beany");
character("m", "Marky", "marky");

// The start chapter 
chapter("start", () => [
	// Write as the protagonist, or you can use it like a narrator
	prota("Two beautiful girls stare at me.");
	
	// Show the character sprite and speak as the character
	show("b");
	char("b", "Oh hi baby");

	show("m");
	char("m", "Hey, that's my line!");
]);

// Start your Visual Novel game
go("vn");
```

## What is KaNovel?
* A plugin of Kaboom for make Visual Novels with a understable API for writers ✅
* A Replit template that merges the Kaboom IDE with the functions of the KaNovel plugin ✅
* A game engine ❌
* A replacement for Kaboom ❌

## Credits
This template are using...

* Kaboom as the core of all the process 🕵🏻
* Beany is a modification of [Agustina](https://dejinyucu.itch.io/agustina-visual-novel-sprite) by [Dejinyucu](dejinyucu.itch.io)
* Backgrounds by Noraneko Games