/*
The menu scene made in Kaboom
*/

export default () => scene("menu", () => {
	const bgm = play("Dubious", { loop: true })

	add([
		sprite("kanovel"),
		origin("center"),
		pos(center()),
	]);
	
	add([
		text("KaNovel"),
		origin("center"),
		pos(center()),
	]);

	add([
		text("Template"),
		origin("center"),
		pos(center().add(0, 60)),
	]);

	add([
		text("Play!", { size: 50, }),
		origin("center"),
		pos(width() / 2, height() - 40),
		area(),
		"btn",
		{
			scene: "vn",
		}
	]);

	add([
		text("Load!", { size: 50, }),
		origin("center"),
		pos(width() / 4, height() - 40),
		area(),
		"btn",
		{
			scene: "saveload",
		}
	]);

	onUpdate("btn", (btn) => {
		if (btn.isHovering()) btn.scale = vec2(1.2);
		else btn.scale = vec2(1);

		if (btn.isClicked()) {
			bgm.stop();
			
			go(btn.scene);
		}
	})
});