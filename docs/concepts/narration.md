---
layout: default
title: Narration
parent: Concepts
nav_order: 3
---

# The narration of your novel

Now understanding the first concepts about `chapters` and `characters`, now we need make **say** things to these characters, yeah, that's is the thing, `say()`

With `say()` we can make our textbox display text, or in more friendly worlds, make the game say things

```js
kanovel()

character("d", "Danie")

chapter("start", () => [
  say("Hello World")
])
```

This code display the text "Hello World" in the textbox, but without a name, only the text, this is util for example for make sound captions, or make the narrator speak, or even make our protagonist **think**

## Our characters speaking