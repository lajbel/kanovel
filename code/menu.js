/*
The menu scene made in Kaboom
*/

export default () => scene("menu", () => {
	add([
		text("KaNovel\nTemplate"),
		origin("center"),
		pos(center()),
	]);

	const btn = add([
		text("Play!", { size: 50, }),
		origin("center"),
		pos(width() / 2, height() - 40),
		area(),
	]);

	btn.onUpdate(() => {
		if (btn.isHovering()) btn.scale = vec2(1.2);
		else btn.scale = vec2(1);

		if (btn.isClicked()) {
			go("vn");
		}
	})
	
	onUpdate(() => {
		if(isKeyPressed("space")) go("vn");
	});
});