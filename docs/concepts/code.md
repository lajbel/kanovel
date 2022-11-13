---
layout: default
title: Code-what?
parent: Concepts
nav_order: 2
---

# Code your game

Don't worry! Yes, if you are here, you want to learn with the most easy words, how to code your novel...

It's easy! the first thing that you need to know it's all KaNovel games starts with `kanovel()`

```javascript
kanovel()
```

## Character

Now, one of the parts of a kanovel game it's `characters`, how we can create a character? No worries, it's easy too!
We will use `character()`, and inside of the `()` we will add a ID, and a Displayable name, separated by comma (this is the way to separate the `arguments`)

```javascript
kanovel()

character("d", "Danie")
```

## A chapter

Another of these 3 parts that make up a novel in Kanovel, are the chapters, and these can be defined with `chapter()`, check this

```js
kanovel()

character("d", "Danie")

chapter("start")
```

The **start** chapter is where your novel starts, inside from chapters, we will have `actions`, you need add one more `argument` to `chapter()`

```js
kanovel()

character("d", "Danie")

chapter("start", () => [
  // here will be the actions
])
```
Yeah! now we have a basically structure for start writing the **narration** of our novel 🐝

