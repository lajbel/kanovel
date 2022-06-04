<p align="center">
	<img src="https://imgur.com/g5mjs4C.png" alt="KaNovel Logo" align="center">
	<p align="center">
		KaNovel is a <a href="https://replit.com">Replit Template</a> & <a href="https://kaboomjs.com">Kaboom</a> Plugin for make Visual Novels in your browser, open source and easy extendable
	</p>
</p>

> Visual novels are a very popular genre of videogames in sectors such as Japan and among the most recurrent readers.
> Our goal is to make the development 100% opensource, in the browser and easily extensible for someone with not much programming knowledge, such as a writer.

Originally made for [Template Jam 2022](https://blog.replit.com/template-jam) by Bean Corporation ©️

## Quick Example
```js 
// We start importing Kaboom and Kanovel plugin
import kaboom from "kaboom";
import kanovelPlugin from "./kanovel";

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

    // Show & Talk as a character
    show("b", "left");
    char("b", "Oh hi baby");
 
    show("m", "right");
    char("m", "Hey, that's my line!");
]);

// Start your Visual Novel game
go("vn");
```

## What's KaNovel?
* A plugin of Kaboom for make Visual Novels with a understable API for writers ✅
* A Replit template that merges the Kaboom IDE with the functions of the KaNovel plugin ✅
* A game engine ❌
* A replacement for Kaboom ❌

## Credits
This template are using...

* Kaboom as the core of all the process 🕵🏻
* All the [music](https://lunalucid.itch.io/free-creative-commons-bgm-collection) by [LunaLucid](https://lunalucid.itch.io/)
* Beany is a modification of [Agustina](https://dejinyucu.itch.io/agustina-visual-novel-sprite) by [Dejinyucu](https://dejinyucu.itch.io)
* Marky is a modification of [Saki](https://liah0227.itch.io/saki) by [Liah0227](https://liah0227.itch.io)
* Backgrounds by Noraneko Games
* APL386 font for the logo text by abrudz