---
layout: default
title: Home
nav_order: 1
---

# KaNovel

KaNovel is a begginer friendly visual novel engine! 🦋

[Tutorial](/concepts) - [Itch.io](https://lajbel.itch.io/kanovel)

## Quick Example

```javascript
// Starts the game
kanovel()

// Define the characters with id, name and sprite
character("b", "Beany", "beany")
character("m", "Marky", "marky")

// The start chapter
chapter("start", () => [
    // Write as the protagonist
    prota("Two beautiful girls stare at me.")

    // Show & Talk as a character
    show("b", "left")
    say("b", "Oh hi baby")

    show("m", "right")
    say("m", "Hey, that's my line!")
]);

// Start the game
go("vn");
```
