<p align="center">
	<img src="https://imgur.com/g5mjs4C.png" alt="KaNovel Logo" align="center">
	<p align="center">
		KaNovel is a  <a href="https://kaboomjs.com">Kaboom</a> Plugin for make Visual Novels in your browser, open source and easy extendable
	</p>
</p>

## Quick Example

```js
// We start importing Kaboom and Kanovel plugin
import kaboom from "kaboom";
import kanovelPlugin from "kanovel";

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
    // Write as the protagonist
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

## Installation

### npm

```
npm i kanovel
```

## What's KaNovel?

-   A plugin of Kaboom for make Visual Novels with a understable API for writers ✅
-   A Replit template that merges the Kaboom IDE with the functions of the KaNovel plugin ✅
-   A game engine ❌
-   A replacement for Kaboom ❌
