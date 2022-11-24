<p align="center">
	<img src="https://imgur.com/g5mjs4C.png" alt="KaNovel Logo" align="center">
	<p align="center">
		KaNovel is a begginer friendly visual novel engine! 🦋
        Using normal concepts you can make a novel :D
	</p>
</p>

> **This engine it's now in active development, may have bugs and unusable features**

## Quick Example

```js
import kanovel from "kanovel";

kanovel();

character("b", "Beany");
character("m", "Marky");

chapter("start", () => [
    say("b", "I'm waiting"),
    say("m", "What?"),
    say("b", "Your visual novel"),
    say("m", "I don't have any knowldges about engines"),
    say("b", "Oh, you tried KaNovel?"),

    jump("documentation"),
]);
```

## Installation

It's recommended use the [Replit Template](https://replit.com/@lajbel/KaNovel?v=1)

### For Devs

#### NPM

```js
npm i kanovel
```

#### CDN

you can load the library from cdns like `jsdelivr` or `unpkg`

## Credits

APL386 font by abrudz
