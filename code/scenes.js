// Some scenes of the Kanovel template, feel free of edit all and make more scenes
// for your perfect visual novel game

const loadMenu = () =>
    scene("menu", () => {
        const bgm = play("Dubious", { loop: true });

        add([sprite("kanovel"), origin("center"), pos(center())]);

        add([text("KaNovel"), origin("center"), pos(center())]);

        add([text("Template"), origin("center"), pos(center().add(0, 60))]);

        add([
            text("Play!", { size: 50 }),
            origin("center"),
            pos(width() / 2, height() - 40),
            area(),
            "btn",
            {
                scene: "kanovel",
            },
        ]);

        onUpdate("btn", (btn) => {
            if (btn.isHovering()) btn.scale = vec2(1.2);
            else btn.scale = vec2(1);

            if (btn.isClicked()) {
                bgm.stop();

                go(btn.scene);
            }
        });
    });

// Exports

export { loadMenu };
