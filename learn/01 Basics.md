# Basics ⛳

KaNovel is too easy, but you need learn it first, don't worry, it's quite easy and fast. Here you will learn how to use KaNovel and start using the **Narration** in your novel

## Load Assets

The first rule is load assets, there will already be a couple of assets loaded in `loader`.

![image](images/DefaultAssets.png)

But the assets are not loaded by magic, they are loaded by code in the `loader` file, so feel free to edit the file to load the sprites you need.

![image](images/CodeAssets.png)

You can use Kaboom Functions\* for load assets

`loadSprite("spriteID", "spritePath")` <br>
`loadSound("soundID", "soundPath")`

\* _for the full options of these functions, check the Kaboom documentation._

## Narration

In a visual novel, It is normal to have chapters, speaking characters in our story.

**All Kanovel's visual novels start with the chapter start**

```js
chapter("start", () => [
    // Here the history make functions
]);
```

Now, the normal thing would be to have a protagonist or a narrator, you're in luck! you don't need to define anything to start using them.

You can speak as the protagonsit with `prota()` function

```js
chapter("start", () => [
    prota("a beautiful night of butterflies");
]);
```

Or if you want use a narrator, you can use `narrator()` (although it is relatively the same)

```js
chapter("start", () => [
    narrator("a beautiful night of butterflies");
]);
```

![Narrator/Protagonist in the game](images/ProtagonistExample.png)

What? You want use a character?

To use characters, we must first define them, for that there is `character()`, with a character id and a character display name

```js
character("m", "Marky");

chapter("start", () => [narrator("a beautiful night of butterflies")]);
```

That's it! Now we can use `char()` to make she talk

```js
character("m", "Marky");

chapter("start", () => [
    narrator("a beautiful night of butterflies"),
    char("m", "yes..."),
]);
```

**TIP:** You can create more chapters and jump to it with `jump()`

![The name is drawn* in the textbox](images/Yes.png)

_\* to see how to edit the text box see Customization_

If you want load a sprite with your character, you need add a extra value to `character()`, and then show it with `show()`

```js
character("m", "Marky", "marky");

chapter("start", () => [
    narrator("a beautiful night of butterflies"),

    show("m", "center"), // showing default sprite in center

    char("m", "yes..."),
]);
```

TODO: Show image

Now, for load various expression, you need add the last value of `character`

```js
character("m", "Marky", "marky", [
    {
        name: "happy",
        sprite: "marky happy",
    },
]);

chapter("start", () => [
    narrator("a beautiful night of butterflies"),

    show("m", "center", "happy"), // showing happy sprite in center

    char("m", "yes..."),
]);
```

Now, for end your game, you can use `end()`

```js
character("m", "Marky", "marky", [
    {
        name: "happy",
        sprite: "marky happy",
    },
]);

chapter("start", () => [
    narrator("a beautiful night of butterflies"),

    show("m", "center", "happy"), // showing happy sprite in center

    char("m", "yes..."),

    jump("end"),
]);

chapter("end", () => [narrator("bye bye"), end()]);
```

You can load backgrounds too! with `bg()` and your bg

```js
chapter("start", () => [bg("yourFavBg")]);
```

And the last, the music, you can use `music()` for reproduce music, and `stop()` for stop it

```js
chapter("musicaly", () => [
    // the sound need be loaded with loadSound
    music("epicsong"),

    prota("ohhi"),

    stop("epicsong"),
]);
```

**TIP:** You can stop all the music with an empty `stop()`

Good! Now you've got the basics to handle storytelling with Kanovel! emember that this is an early version and we are constantly improving, check the [roadmap](https://github.com/lajbel/kanovel/projects/1)
