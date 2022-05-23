import k from "./main";

export default () => scene("menu", () => {
	add([
		text("KaNovel\nTemplate"),
		origin("center"),
		pos(center()),
	]);

	const btn = add([
		text("Start!", { size: 50, }),
		origin("center"),
		pos(width() / 2, height() - 40),
		area(),
	]);

	btn.onUpdate(() => {
		if (btn.isHovering()) {
			const t = time() * 10
			btn.color = rgb(
				wave(0, 255, t),
				wave(0, 255, t + 2),
				wave(0, 255, t + 4),
			)
			btn.scale = vec2(1.2)
		} else {
			btn.scale = vec2(1)
			btn.color = rgb()
		}

		if (btn.isClicked()) {
			go("vn");
		}
	})
	
	onUpdate(() => {
		if(isKeyPressed("space")) go("vn");
	});
});