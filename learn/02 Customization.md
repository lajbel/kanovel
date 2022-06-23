# Customization 🎨

The Customization in KaNovel are too easy thanks to the `kanovel()` function, here you will learn how to edit things that kanovel comes with by default, like the textbox, the namebox and default styles

## Textbox

```js
kanovel({
    textbox: {
        sprite: "txt", // textbox sprite
        pos: [29, 29], // textbox pos, x and y
        width: 800,
        height: 300,
        // configuration for text in the textbox
        text: {
            font: "sinko", // font loaded with kaboom
            maxWidth: 700, // wraps the text when...
        },
    },
});
```

**TIP:** KaNovel supports intelissense, you can got help with it!

## End Scene

You can customize your end scene with the parameters `goTo` for decide the `kaboom scene` to go after click the end screen, and `endScene`, if you want do a custom end scene

```js
// scene is a kaboom function
scene("trueEnd", () => [
	add([
		text("this is the true end"),
		origin("center"),
		pos("center"),
	]);
]);

// kanovel chapter
chapter("trueend", () => [
	end("trueEnd"),
]);
```

## Advanced Users

If you are a advanced user with javascript and kaboom, you can make plugins for KaNovel or add more things, simple edit `kanovel.ts`. if you think your change is useful enough for visual novel developers, please make a pull request in the [KaNovel Repos](https://github.com/lajbel/kanovel)

**TIP:** When Kaboom releases 2001, and `parent objects` exist, more extensive support to user modifications will be added

### Custom events

You can create a custom event with a function returning a object
```js
function jumpToScene(scene) {
    return {
        id: "jumpToScene",
        exe: () => {
            // your function execute

            jump(scene)
        },
        skip: true, // if auto run the next event
    }
}
```