/*
The end scene made in Kaboom
*/

export default () => scene("end", () => {
	add([
		rect(width(), height()),
		color(0, 0, 0),
	]);
	
	add([
		text("The End"),
		origin("center"),
		pos(center()),
	]);
});