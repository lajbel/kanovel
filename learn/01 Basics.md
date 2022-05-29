## The start

The first rule is that Kanovel is based on Kaboom, so we will start installing kaboom with `npm i kaboom@2000.2.8`

## Characters

In a visual novel, It is normal to have speaking characters in our story.
There are both narrator, main character and secondary characters, we will see how to create an example of each in KaNovel.

### Protagonist & Narrator

You're in luck, you don't need to do anything to start defining your protagonist, KaNovel has already got the `prota()` function.

```js
chapter("start", () => [
	prota("a beautiful night of butterflies"),
]);
```