/*
Here you can load all assets for your Visual Novel! you only need
use the Kaboom's functions

loadSprite
loadAudio
*/

export default function loadAssets() {
	loadSprite("textbox", "sprites/textbox.png");
	loadSprite("train", "sprites/train.png");
	loadSprite("beany", "sprites/beany.png");
	loadSprite("marky", "sprites/marky.png");
	loadSprite("kanovel", "sprites/kanovel.png");

	loadSound("Dubious", "sounds/Dubious.mp3");
	loadSound("Moar BGM", "sounds/Moar BGM.mp3");
}