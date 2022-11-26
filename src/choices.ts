import type { KaboomCtx } from "kaboom";

export function knChoice() {
	return {

	};
}

export function addChoices(k: KaboomCtx, choices: any[]) {
	let firstPosition = k.vec2(k.center().x, 100);

	choices.forEach((c) => {
		const choiceParent = k.add([
			k.pos(firstPosition),
			k.z(10),
		]);

		choiceParent.add([
			k.pos(0),
			k.rect(100, 100),
		]);
	});
}