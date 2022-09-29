![](https://imgur.com/g5mjs4C.png)

KaNovel is a begginer friendly visual novel engine! 🦋
Using normal concepts you can make a novel :D

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

// The start of your story
chapter("start", () => [
    // Make your protagonist talk
    prota("Two beautiful girls stare at me."),

    // Show & Talk as a character
    show("b", "left"),
    char("b", "Oh hi baby"),

    show("m", "right");
    char("m", "Hey, that's my line!"),
]);

// Start your Visual Novel game
go("vn");
```

## Installation

## For Devs

### npm

```js
npm i kanovel
```

### cdn

you can load the library from cdns like `jsdelivr` or `unpkg`
