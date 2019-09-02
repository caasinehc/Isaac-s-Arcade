let aceEditor = ace.edit("editor");
aceEditor.setTheme("ace/theme/monokai");
aceEditor.setTheme("ace/theme/monokai"); // Automatically loaded, just pass a string
aceEditor.setFontSize(16);
// aceEditor.resize(); // Updates the ace size
aceEditor.session.setMode("ace/mode/javascript");

// Elements on the page
let elems = {};
elems.icebox            = document.getElementById("icebox");
elems.editor            = document.getElementById("editor");
elems.resizer           = document.getElementById("resizer");
elems.frame             = document.getElementById("frame");
elems.files             = {};
elems.files.main        = document.getElementById("files");
elems.files.html        = {};
elems.files.html.div    = document.getElementById("filesHTML");
elems.files.html.header = elems.files.html.div.children[0];
elems.files.html.files  = [];
elems.files.css         = {};
elems.files.css.div     = document.getElementById("filesCSS");
elems.files.css.header  = elems.files.css.div.children[0];
elems.files.css.files   = [];
elems.files.js          = {};
elems.files.js.div      = document.getElementById("filesJS");
elems.files.js.header   = elems.files.js.div.children[0];
elems.files.js.files    = [];
elems.files.lib         = {};
elems.files.lib.div     = document.getElementById("filesLIB");
elems.files.lib.header  = elems.files.lib.div.children[0];
elems.files.lib.files   = [];

// Island of misfit variables
let isRisizerDragging;

// Project
let project;

// sha256
function sha256(ascii, binary = false) {
	function rightRotate(value, amount) {
		return (value >>> amount) | (value << (32 - amount));
	}
	
	let maxWord = 2 ** 32;
	let result = "";

	let words = [];
	let asciiBitLength = ascii.length * 8;
	
	let hash = [];
	let k = [];
	let primeCounter = 0;

	let isComposite = {};
	for(let candidate = 2; primeCounter < 64; candidate++) {
		if(!isComposite[candidate]) {
			for(let i = 0; i < 313; i += candidate) {
				isComposite[i] = candidate;
			}
			hash[primeCounter] = (Math.sqrt(candidate) * maxWord) | 0;
			k   [primeCounter] = (Math.cbrt(candidate) * maxWord) | 0;
			primeCounter++;
		}
	}

	ascii += "\x80";
	while(ascii.length % 64 - 56) ascii += "\x00";
	for(let i = 0; i < ascii.length; i++) {
		let j = ascii.charCodeAt(i);
		if(j >> 8) return;
		words[i >> 2] |= j << ((3 - i) % 4) * 8;
	}
	words[words.length] = ((asciiBitLength / maxWord) | 0);
	words[words.length] = (asciiBitLength);

	for(let j = 0; j < words.length;) {
		let w = words.slice(j, j += 16);
		let oldHash = hash;

		hash = hash.slice(0, 8);
		
		for(let i = 0; i < 64; i++) {
			let i2 = i + j;

			let w15 = w[i - 15];
			let w2  = w[i - 2];

			let a = hash[0];
			let e = hash[4];
			let temp1 = (
				hash[7] +
				(rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
				((e & hash[5]) ^ ((~e) & hash[6])) +
				k[i] + (
					w[i] = (i < 16) ? w[i] : (
						w[i - 16] +
						(rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
						w[i - 7] +
						(rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
					) | 0
				)
			);

			let temp2 = (
				(rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
				((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]))
			);
			
			hash = [(temp1 + temp2) | 0].concat(hash);
			hash[4] = (hash[4] + temp1) | 0;
		}
		
		for(let i = 0; i < 8; i++) {
			hash[i] = (hash[i] + oldHash[i]) | 0;
		}
	}
	
	for(let i = 0; i < 8; i++) {
		for(let j = 3; j + 1; j--) {
			let b = (hash[i] >> (j * 8)) & 255;
			result += ((b < 16) ? 0 : "") + b.toString(16);
		}
	}

	if(binary) {
		result = result.split("").map(char => {
			bin = parseInt(char, 16).toString(2);
			paddedBin = "0".repeat(4 - bin.length) + bin;
			return paddedBin;
		}).join("");
	}
	return result;
}

// Project class
function Project() {
	function getUnusedName(prefix, list) {
		for(let i = 1; i < Infinity; i++) {
			let taken = false;
			for(let file of list) {
				if(file.name === (prefix + " " + i)) {
					taken = true;
					continue;
				}
			}
			if(!taken) return prefix + " " + i;
		}
	}
	
	// File class (private to the Project class)
	function File(name, type, project) {
		function esc(str) {
			return str.replace(/"/g, "\\u0022");
		}
		
		this.name = name;
		this.type = type;
		this.lastModified = new Date().getTime();
		this.session;
		this.elem;
		this.aceType = ({
			"html": "html",
			"css": "css",
			"js": "javascript",
			"lib": "text"
		})[this.type];
		
		// Initialize session
		this.session = new ace.EditSession("");
		this.session.setMode("ace/mode/" + this.aceType);
		this.session.on("change", function() {
			compile(project);
		})
		
		// Create the p elem representing this file
		this.elem = document.createElement("p");
		let textNode = document.createTextNode(this.name);
		this.elem.appendChild(textNode);
		this.elem.classList.add("filesFile");
		this.elem.onclick = () => {
			switchToFile(this);
		}
		this.elem.ondblclick = () => {
			this.elem.classList.add("filesFileEditing");
			this.elem.contentEditable = true;
			this.elem.focus();
		}
		this.elem.onblur = () => {
			this.elem.classList.remove("filesFileEditing");
			this.elem.contentEditable = false;
			this.name = this.elem.innerText;
		}
		this.elem.onkeydown = (e) => {
			if(e.key === "Enter") {
				this.elem.blur();
			}
		}
		elems.files[this.type].div.appendChild(this.elem);
		
		this.setText = function(text) {
			return this.session.setValue(text);
		}
		
		this.getText = function() {
			return this.session.getValue();
		}
		
		this.setName = function(name) {
			this.name = name;
			this.elem.innerText = name;
		}
		
		this.getName = function() {
			return this.name;
		}
		
		this.toString = function() {
			return JSON.stringify({
				name: this.name,
				lastModified: this.lastModified,
				data: this.getText()
			});
		}
	}
	
	this.name = "";
	this.lastModified = new Date().getTime();
	this.files = {
		html: new File("index", "html", this),
		css: [],
		js: [],
		lib: []
	};
	
	this.addCSS = function() {
		let name = getUnusedName("style ", this.files.css);
		this.files.css.push(new File(name, "css", this));
	}
	
	this.addJS = function() {
		let name = getUnusedName("script ", this.files.js);
		this.files.js.push(new File(name, "js", this));
	}
	
	this.addLIB = function() {
		let name = getUnusedName("library ", this.files.lib);
		this.files.lib.push(new File(name, "lib", this));
	}
	
	// Combines the HTML, css, and js into one html string
	// TODO Allow retrieving libraries from the web (ex: https://caasinehc.github.io/ice/src/ice.js)
	this.toCombinedHTML = function() {
		function indent(text) {
			return "\t" + text.split("\n").join("\n\t");
		}
		function removeLastChar(text) {
			return text.substring(0, text.length - 1);
		}
		function escapeStyleTag(str) {
			return str.replace(/<\/style>/g, "<\\u002fstyle>")
		}
		function escapeScriptTag(str) {
			return str.replace(/<\/script>/g, '<\\u002fscript>')
		}
		
		// css files to style tags
		let styles = "";
		for(let css of this.files.css) {
			styles += (`<style>\n${indent(escapeStyleTag(css.getText()))}\n</style>\n`);
		}
		styles = removeLastChar(styles);
		
		// libs to script tags
		let libs = "";
		for(let lib of this.files.lib) {
			libs += `<script src=\"${lib.getText()}\"></script>\n`;
		}
		libs = removeLastChar(libs);
		
		// js files to script tags
		let scripts = "";
		for(let js of this.files.js) {
			scripts += `<script>\n${indent(escapeScriptTag(js.getText()))}\n</script>\n`;
		}
		scripts = removeLastChar(scripts);
		
		let combinedHTML = "<DOCTYPE html>\n<html>\n";
		combinedHTML += indent(`${this.files.html.getText()}\n${styles}\n${libs}\n${scripts}`);
		combinedHTML += "\n</html>";
		
		return combinedHTML;
	}
	
	this.removeElems = function() {
		this.files.html.elem.remove();
		for(let file of this.files.css) file.elem.remove();
		for(let file of this.files.js)  file.elem.remove();
		for(let file of this.files.lib) file.elem.remove();
	}
	
	this.toString = function() {
		// Create an object with the stringified files
		let filesObj = {};
		filesObj.html = this.files.html.toString();
		filesObj.css = [];
		for(let file of this.files.css) filesObj.css.push(file.toString());
		filesObj.js = [];
		for(let file of this.files.js) filesObj.js.push(file.toString());
		filesObj.lib = [];
		for(let file of this.files.lib) filesObj.lib.push(file.toString());
		
		// Create the project string
		let projectString = "Icebox Project" + JSON.stringify({
			name: this.name,
			lastModified: this.lastModified,
			files: filesObj
		});
		
		// Calculate the project hash
		let hash = sha256(projectString);
		
		return `${projectString}sha256:${hash}`;
	}
}

Project.fromString = function(str) {
	let projectStr = str.substr(14, str.length - 85);
	let hash = str.substr(str.length - 64, 64);
	
	// Check the hash to ensure there was no corruption
	if(sha256("Icebox Project" + projectStr) !== hash) {
		console.warn("Warning! Project hash didn't match... the project may have been corrupted!");
	}
	
	// Parse the project string
	let newProjectData = JSON.parse(projectStr);
	newProjectData.files.html = JSON.parse(newProjectData.files.html);
	newProjectData.files.css  = newProjectData.files.css.map(JSON.parse);
	newProjectData.files.js   = newProjectData.files.js.map(JSON.parse);
	newProjectData.files.lib  = newProjectData.files.lib.map(JSON.parse);
	
	console.log(newProjectData);
	
	// Build the project
	let newProject = new Project();
	newProject.name = newProjectData.name;
	newProject.lastModified = newProjectData.lastModified;
	
	newProject.files.html.name = newProjectData.files.html.name;
	newProject.files.html.lastModified = newProjectData.files.html.lastModified;
	newProject.files.html.setText(newProjectData.files.html.data);
	
	for(let i = 0; i < newProjectData.files.css.length; i++) {
		let data = newProjectData.files.css[i];
		newProject.addCSS();
		newProject.files.css[i].setName(data.name);
		newProject.files.css[i].lastModified = data.lastModified;
		newProject.files.css[i].setText(data.data);
	}
	
	for(let i = 0; i < newProjectData.files.js.length; i++) {
		let data = newProjectData.files.js[i];
		newProject.addJS();
		newProject.files.js[i].setName(data.name);
		newProject.files.js[i].lastModified = data.lastModified;
		newProject.files.js[i].setText(data.data);
	}
	
	for(let i = 0; i < newProjectData.files.lib.length; i++) {
		let data = newProjectData.files.lib[i];
		newProject.addLIB();
		newProject.files.lib[i].setName(data.name);
		newProject.files.lib[i].lastModified = data.lastModified;
		newProject.files.lib[i].setText(data.data);
	}
	
	return newProject;
}

// Switches the file in the editor
// Expects a file from a project object (I'm Dr. Seuss apparently)
function switchToFile(file) {
	aceEditor.setSession(file.session);
	aceEditor.session.setMode(`ace/mode/${file.aceType}`);
}

// Resizer code
// This person is literally my favorite person on the whole fucking planet
// https://stackoverflow.com/a/46934825
isResizerDragging = false;

// Start dragging if mousedown on resizer
document.addEventListener("mousedown", function(e) {
	if(e.target === elems.resizer) isResizerDragging = true;
});

// Drag if dragging
document.addEventListener("mousemove", function(e) {
	if(isResizerDragging) {
		// big ass motherfucking thank you to this guy for preventing a murder-suicide
		// https://stackoverflow.com/a/46934825
		let containerOffsetLeft = elems.icebox.offsetLeft + elems.files.main.offsetWidth;
		let pointerRelativeXpos = e.clientX - containerOffsetLeft;
		
		let minWidth = 100;
		let newWidth = (Math.min(Math.max(minWidth, pointerRelativeXpos - 8), elems.icebox.clientWidth - elems.files.main.offsetWidth - minWidth));
		elems.editor.style.width = newWidth + "px";
		elems.editor.style.flexGrow = 0;
		
		// stops it from doing that retarded shit with the highlighting
		e.preventDefault();
	}
});

// Stop dragging when mouse is released
document.addEventListener("mouseup", function(e) {
	isResizerDragging = false;
})

// iframe code
function setFrameCode(code) {
	let frameWindow = elems.frame.contentWindow;
	
	frame.onload = function() {
		console.clear();
		frameDocument = frameWindow.document;
		frameHTMLTag = frameDocument.getElementsByTagName("html")[0];
		
		frameDocument.open();
		frameDocument.write(code);
		frameDocument.close();
	}
	frameWindow.location.reload();
}

function compile(project) {
	setFrameCode(project.toCombinedHTML());
}

function loadProject(projectStr) {
	project.removeElems();
	project = Project.fromString(projectStr);
	switchToFile(project.files.html);
}

// TODO TEMP
project = new Project();
let defaultProject = `Icebox Project{\"name\":\"\",\"lastModified\":1567381492691,\"files\":{\"html\":\"{\\\"name\\\":\\\"index\\\",\\\"lastModified\\\":1567381492691,\\\"data\\\":\\\"<body>\\\\r\\\\n\\\\t<h1>This is my webpage.</h1>\\\\r\\\\n</body>\\\"}\",\"css\":[\"{\\\"name\\\":\\\"style\\\",\\\"lastModified\\\":1567381492694,\\\"data\\\":\\\"body {\\\\r\\\\n\\\\tbackground-color: gray;\\\\r\\\\n\\\\tfont-family: \\\\\\\"Arial\\\\\\\";\\\\r\\\\n}\\\"}\"],\"js\":[\"{\\\"name\\\":\\\"code\\\",\\\"lastModified\\\":1567381492695,\\\"data\\\":\\\"function init() {\\\\n    // Init\\\\n}\\\\n\\\\nfunction tick() {\\\\n    // Tick\\\\n}\\\\n\\\\nfunction render() {\\\\n    // Render\\\\n}\\\"}\"],\"lib\":[\"{\\\"name\\\":\\\"ice\\\",\\\"lastModified\\\":1567381492696,\\\"data\\\":\\\"https://rebrand.ly/ice\\\"}\",\"{\\\"name\\\":\\\"ice.framework\\\",\\\"lastModified\\\":1567382816000,\\\"data\\\":\\\"https://rebrand.ly/ice-fw\\\"}\"]}}sha256:39bff5c3468aef98172f34408ad741b587bb9d6ef4470f2ee6b3e5b7175a2cf0`;
loadProject(defaultProject);