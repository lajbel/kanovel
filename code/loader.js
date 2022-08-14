// Here you can load all assets for your Visual Novel! you only need
// use the Kaboom's functions as loadSprite and loadSound

export default function loadAssets() {
    loadSprite("textbox", "sprites/textbox.png");
    loadSprite("choice", "sprites/choice.png");
    loadSprite("train", "sprites/train.png");
    loadSprite("beany", "sprites/beany.png");
    loadSprite("marky", "sprites/marky.png");
    loadSprite("kanovel", "sprites/kanovel.png");

    loadSound("Dubious", "sounds/Dubious.mp3");
    loadSound("Moar BGM", "sounds/Moar BGM.mp3");

    scene("clickhere", () => {
        add([rect(width(), height()), color(0, 0, 0)]);
        add([text("Click to Start"), origin("center"), pos(center())]);

        onClick(() => {
            go("menu");
        });
    });

    go("clickhere");
}
