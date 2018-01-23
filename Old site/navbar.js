var backToTheFuture = (
	'<li style="float: right;">' +
//                                          Sorry couldn't help it...
	'  <a href="../../index.html" id="BTTF">Back to the Future</a>' +
	'</li>'
);
var contents = (
	'<li>' +
	'  <a href="../Home/Home.html" id="homeButton">Home</a>' +
	'</li>' +
	'<li id="gamesDropdown">' +
	'  <a href="#" id="gamesButton">Games</a>' +
	'  <div id="games">' +
	'    <a href="../Don\'t%20Touch%20Red!/Don\'t%20touch%20red!.html" id="dontTouchRedButton">Don\'t Touch Red!</a>' +
	'    <a href="../Snakes/Snakes.html" id="snakesButton">Snakes</a>' +
	'    <a href="../Skeet%20Hero/Skeet%20Hero.html" id="skeetHeroButton">Skeet Hero</a>' +
	'    <a href="../Gostkowski%20Simulator/Gostkowski%20Simulator.html" id="gostkowskiSimulatorButton">Gostkowski Simulator</a>' +
	'    <a href="../Stacker/Stacker.html" id="stackerButton">Stacker</a>' +
	'    <a href="../Colorspot/Colorspot.html" id="colorspotButton">Color Spot</a>' +
	'  </div>' +
	'</li>' +
	'<li id="randomDropdown">' +
	'  <a href="#" id="randomButton">Random</a>' +
	'  <div id="random">' +
	'    <a href="../Bonsai%20Simulator/Bonsai%20Simulator.html" id="bonsaiSimulatorButton">Bonsai Simulator</a>' +
	'    <a href="../Particles/Particles.html" id="particlesButton">Particles</a>' +
	'    <a href="../Canvas%20Pen/Canvas%20Pen.html" id="canvasPenButton">Canvas Pen</a>' +
	'    <a href="../Circle%20Generator/Circle.html" id="circleButton">Circle Generator</a>' +
	'    <a onclick="seeecretInput(prompt(&quot;Enter the super seeecret password...&quot));" id="seeecretButton">Seeecret stuff</a>' +
	'  </div>' +
	'</li>' +
	backToTheFuture
);
var navbar = document.getElementById("navBar");
navbar.innerHTML = contents;

function removeRemix() {
	var elements = document.getElementsByClassName("details-bar");
	var i;
	for(i = 0; i < elements.length; i++) {
		elements[i].parentNode.removeChild(elements[i]);
	}
	return i;
}
var interval = setInterval(function() {
	if(removeRemix() > 0) {
		clearInterval(interval);
	}
}, 1);

// Seeecret input management
// SSSSSHHHH!!!!!

/*
Encrypt
*/
/*
document.write("<body><input id=\"input\" /><p id=\"text\"></p><p id=\"output\"></p><p id=\"decr\"></p></body>");
var input = document.getElementById("input");
var text = document.getElementById("text");
var output = document.getElementById("output");
var decr = document.getElementById("decr");
input.oninput = function() {
	text.innerText = input.value;
	output.innerText = btoa(input.value);
	try {
		decr.innerText = atob(input.value);
    }
	catch(e) {
		decr.innerText = "Invalid";
	}
}
*/

var page = page || undefined;

function navTo(url) {
	window.location.assign(atob(url));
}

function notHere() {
	alert(atob("WW91IGNhbid0IHVzZSB0aGF0IGhlcmUuLi4="))
}

var inputs = {
	"dG9kbw==": function() {
		navTo("Li4vVG9kby50eHQ=");
	},
	"c21vb3RoZXJ3YWxs": function() {
		navTo("Li4vU21vb3RoZXJXYWxsL1Ntb290aGVyV2FsbC5odG1s");
	},
	"c21vb3Rod2FsbA==": function() {
		navTo("Li4vU21vb3RoZXJXYWxsL1Ntb290aGVyV2FsbC5odG1s");
	},
	"Ym9va21hcmtsZXRz": function() {
		navTo("Li4vQm9va21hcmtsZXRzL0Jvb2ttYXJrbGV0cy5odG1s");
	},
	"ZW1wdHk=": function() {
		navTo("Li4vRW1wdHlQYWdlL0VtcHR5UGFnZS5odG1s");
	},
	"bm90aGluZw==": function() {
		navTo("Li4vRW1wdHlQYWdlL0VtcHR5UGFnZS5odG1s");
	},
	"bWFyaw==": function() {
		if(page === atob("SG9tZQ==")) {
			document.getElementById(atob("bWFya0Vhc3RlckVnZw==")).innerHTML = markText;
		}
		else {
			notHere();
		}
	},
	"bWlyYWNsZWdyb3c=": function() {
		if(page === atob("Qm9uc2FpIFNpbXVsYXRvcg==")) {
			miracleGrow();
		}
		else {
			notHere();
		}
	},
	"bWlyYWNsZSBncm93": function() {
		if(page === atob("Qm9uc2FpIFNpbXVsYXRvcg==")) {
			miracleGrow();
		}
		else {
			notHere();
		}
	},
	"bWdyb3c=": function() {
		if(page === atob("Qm9uc2FpIFNpbXVsYXRvcg==")) {
			miracleGrow();
		}
		else {
			notHere();
		}
	},
	"Xl52djw+PD5iYQ==": function() {
		if(page === atob("RG9uJ3QgVG91Y2ggUmVkIQ==") || page === atob("U25ha2Vz")) {
			invulnerable = !invulnerable;
		}
		else {
			notHere();
		}
	},
	"Y2hlYXQ=": function() {
		if(page === atob("RG9uJ3QgVG91Y2ggUmVkIQ==") || page === atob("U25ha2Vz")) {
			invulnerable = !invulnerable;
		}
		else {
			notHere();
		}
	},
	"Ym90": function() {
		if(page === atob("RG9uJ3QgVG91Y2ggUmVkIQ==")) {
			toggleBot();
		}
		else {
			notHere();
		}
	},
	"YWk=": function() {
		if(page === atob("RG9uJ3QgVG91Y2ggUmVkIQ==")) {
			toggleBot();
		}
		else {
			notHere();
		}
	},
	"ZGlzY28=": function() {
		if(page === atob("Q29sb3JzcG90")) {
			toggleDisco();
		}
		else {
			notHere();
		}
	},
	"c3Bvb2t5": function() {
		if(page === atob("Qm9uc2FpIFNpbXVsYXRvcg==") || page === atob("RG9uJ3QgVG91Y2ggUmVkIQ==") || page === atob("U2tlZXQgSGVybw==") || page === atob("U3RhY2tlcg==")) {
			halloweenMode = !halloweenMode;
		}
		else {
			notHere();
		}
	}
}

function seeecretInput(input) {
	var inputString = typeof input === "string" ? input.toLowerCase() : "";
	if(inputs[btoa(inputString)]) {
		inputs[btoa(inputString)]();
	}
	else {
		alert(wrongPassResponses[Math.floor(Math.random() * wrongPassResponses.length)]);
	}
}

var wrongPassResponses = [
  "lolno",
  "False",
  "More toppings!", // reference to a game that was my childhood, Zoombinis
  "Wrong.", // subtle reference to a certain controversial American president...
  "Turn back...",
  "Try again",
  "404: missing correct password",
  "The super seeecret password is super seeecret for a reason...",
  "YOU SHALL NOT PASS.", // LOTR reference
  "What happens if you use the seed \"#dion\"...?", // Bonsai simulator hint
  "What happens if you use the seed \"#stats\"...?", // Bonsai simulator hint
  "What happens if you use the seed \"#graph\"...?", // Bonsai simulator hint
  "This area is ruled by Debug Doug!", // reference to my debugging assistant, Debug Doug
  "Beware",
  "The password is ******",
  "The password is not ******",
  "SSSSHHHHHH!!!",
  "Did you try turning it off and on again?", // IT joke
  "Secret messages often occur treading hidden easily, right where assumed least likely", // The first letters spell out "Smootherwall"
  "|< () |\\| /-\\ |\\/| |   ( () |) 3", // Konami code hint
  "!correct",
  "I'm sorry, Dave. I'm afraid I can't do that.", // reference to 2001: A Space Odyssey
];
var markText = (
	'<h1>emocleW ot s\'caasI !edacrA</h1>' +

	'<p>yM amen si caasI nehC, dna I ma eht rotaerc fo siht etis. I evah a noissap rof retupmoc gnimmargorp, dna dediced ot ekam a etisbew htiw lla ym semag/smargorp. oT kcehc meht tuo, esu het noitagivan rab evoba. fI uoy dluow ekil ot ees eht ecruos edoc, thgir kcilc erehwyna no siht agep, neht kcilc "tcepsnI" ro "tcepsnI tnemele".</p>' +

	'<p>lleW, tahw era uoy gnitiaw rof? teG ot gniyalp!</p>'
);
