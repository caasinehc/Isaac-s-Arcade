canvas.style.cursor = "none";

let skeets = [];
let cooldown = 0;
let halloweenMode = false;
let sounds = {
	gunshot: "Assets/Audio/gunshot.mp3",
	reload: "Assets/Audio/reload.mp3"
}

function click(e, button) {
	if(cooldown === 0) {
		cooldown = floor(1000 / frameRate());
		setTimeout(() => {audio.play(sounds.reload);}, 750);
	}
}

function tick() {
	if(cooldown > 0) cooldown--;
}

function render() {
	// <TEMP>
	if(window.location.href.startsWith("file:///")) taint();
	// </TEMP>
	image("Assets/Images/background.png");
}
