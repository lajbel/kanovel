---
layout: default
title: Home
nav_order: 1
---

# KaNovel

KaNovel is a begginer friendly visual novel engine! 🦋

[Tutorial](/concepts) - [Itch.io](https://lajbel.itch.io/kanovel)

## Quick Example

```js
import kanovel from "kaboom";

kanovel();

character("b", "Beany", "beany");
character("m", "Marky", "marky");

chapter("start", () => [
    say("b", "He is waiting"),

    show("m", "center"),
    say("m", "Who?"),

    say("b", "What?"),
]);
```