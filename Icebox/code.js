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

// Island of misfit variables
let isRisizerDragging;

// Project class
function Project() {
	// File class (private to the Project class)
	function File(name, type, project) {
		this.name = name;
		this.type = type;
		this.session;
		this.elem;
		
		// Initialize session
		this.session = new ace.EditSession("");
		this.session.setMode("ace/mode/" + this.type);
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
		     if(this.type === "html")       elems.files.html.div.appendChild(this.elem);
		else if(this.type === "css")        elems.files.css.div.appendChild(this.elem);
		else if(this.type === "javascript") elems.files.js.div.appendChild(this.elem);
		
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
			new File("code", "javascript", this)
		]
	};
	
	// Combines the HTML, css, and js into one html string
	// TODO Allow retrieving libraries from the web (ex: https://caasinehc.github.io/ice/src/ice.js)
	// TODO Potentially breaks when js/css code contains strings like "</script>"
	this.toCombinedHTML = function() {
		function indent(text) {
			return "\t" + text.split("\n").join("\n\t");
		}
		function removeLastChar(text) {
			return text.substring(0, text.length - 1);
		}
		
		// css files to style tags
		let styles = "";
		for(let css of this.files.css) {
			styles += (`<style>\n${indent(css.getText())}\n</style>\n`);
		}
		styles = removeLastChar(styles);
		
		// js files to script tags
		let scripts = "";
		for(let js of this.files.js) {
			scripts += `<script>\n${indent(js.getText())}\n</script>\n`;
		}
		scripts = removeLastChar(scripts);
		
		return `<DOCTYPE html>\n<html>\n${indent(`${this.files.html.getText()}\n${styles}\n${scripts}`)}\n</html>`;
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
	aceEditor.session.setMode(`ace/mode/${file.type}`);
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
		let containerOffsetLeft = elems.icebox.offsetLeft + elems.files.offsetWidth;
		let pointerRelativeXpos = e.clientX - containerOffsetLeft;
		
		let minWidth = 100;
		let newWidth = (Math.min(Math.max(minWidth, pointerRelativeXpos - 8), elems.icebox.clientWidth - elems.files.offsetWidth - minWidth));
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
project.files.html.setText(defaultHTML);
project.files.css[0].setText(defaultCSS);
project.files.js[0].setText(defaultJS);
switchToFile(project.files.html);