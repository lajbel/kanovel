/*
Here you can load all assets for your Visual Novel! you only need
use the Kaboom function

loadSprite
loadAudio
*/

import k from "./main";

export default function loadAssets() {
	loadSprite("textbox", "sprites/textbox.png");
	loadSprite("train", "sprites/train.png");
	loadSprite("beany", "sprites/beany.png");
}