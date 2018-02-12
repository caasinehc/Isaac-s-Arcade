if(typeof ice === "undefined") ice = {modules: []};
(function() {
	if(!ice.modules.includes("audio")) ice.modules.push("audio");
	ice.audio = {};
	ice.audio.version = "v1.0.0"; // This version of the ice.audio module
	console.log("%cice.audio " + ice.audio.version + " imported successfully.", "color: #008000");

	/*
	 *	================ Audio Module ================
	 */

	// Constructors

	ice.audio.play = function(src) {
		let sound = new Audio(src);
		sound.play();
		return sound;
	}
})();
