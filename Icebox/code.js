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
		this.name = name;
		this.type = type;
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
		this.elem.className = "filesFile";
		this.elem.onclick = () => {
			switchToFile(this);
		}
		elems.files[this.type].div.appendChild(this.elem);
		
		this.getText = function() {
			return this.session.getValue();
		}
		
		this.setText = function(text) {
			return this.session.setValue(text);
		}
	}
	
	this.name = "";
	this.files = {
		html: new File("index", "html", this),
		css: [
			new File("style", "css", this)
		],
		js: [
			new File("code", "js", this)
		],
		lib: [
			new File("ice", "lib", this)
		]
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
	
	// TODO
	this.toString = function() {
		console.warn("Project.toString() is not yet ready!");
		return "Project.toString() is not yet ready!";
	}
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

// TODO TEMP
let project = new Project();
let defaultHTML = (
`<body>
	<h1>This is my webpage.</h1>
</body>`
);
let defaultCSS = (
`body {
	background-color: gray;
}`
);
let defaultJS = (
`// Javascript code here!`
);
let defaultLIB = (
`https://rebrand.ly/ice`
);
project.files.html.setText(defaultHTML);
project.files.css[0].setText(defaultCSS);
project.files.js[0].setText(defaultJS);
project.files.lib[0].setText(defaultLIB);
switchToFile(project.files.html);