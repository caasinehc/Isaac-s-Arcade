let aceEditor = ace.edit("editor");
aceEditor.setTheme("ace/theme/monokai"); // Automatically loaded, just pass a string
aceEditor.setFontSize(16);
aceEditor.session.setUseSoftTabs(false);
aceEditor.session.setMode("ace/mode/javascript");
// Ctrl+r run shortcut
aceEditor.commands.addCommand({
	name: "compileCode",
	bindKey: {win: "Ctrl-r", mac: "Command-r"},
	exec: function() {
		compile(project);
	}
});
// Ctrl+p project shortcut
aceEditor.commands.addCommand({
	name: "manageProjects",
	bindKey: {win: "Ctrl-p", mac: "Command-p"},
	exec: function() {
		showPopup();
	}
});

// Elements on the page
let elems = {};
elems.popup             = {};
elems.popup.main        = document.getElementById("popup");
elems.popup.background  = document.getElementById("popupBackground");
elems.popup.content     = document.getElementById("popupContent");
elems.popup.list        = document.getElementById("popupList");
elems.icebox            = document.getElementById("icebox");
elems.editor            = document.getElementById("editor");
elems.resizer           = document.getElementById("resizer");
elems.frame             = document.getElementById("frame");
elems.files             = {};
elems.files.main        = document.getElementById("files");
elems.files.autorun     = {};
elems.files.autorun.div = document.getElementById("filesAutorun");
elems.files.autorun.cb  = document.querySelector(".filesAutorunCheckbox");
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
let readyToSaveToLS = false;
let selectedIndex = 0;
let firstCompile = true;

// Project
let project;
let projectIndex;
let projects;
let defaultProjectStr = "Icebox$sProject{\"name\":\"New$sproject\",\"lastModified\":1567381492691,\"files\":{\"html\":\"{\\\"name\\\":\\\"index\\\",\\\"lastModified\\\":1567381492691,\\\"data\\\":\\\"<body>\\\\r\\\\n\\\\t<h1>This$sis$smy$swebpage.<\/h1>\\\\r\\\\n<\/body>\\\"}\",\"css\":[\"{\\\"name\\\":\\\"style\\\",\\\"lastModified\\\":1567381492694,\\\"data\\\":\\\"body$s{\\\\r\\\\n\\\\tbackground-color:$sgray;\\\\r\\\\n\\\\tfont-family:$s\\\\\\\"Arial\\\\\\\";\\\\r\\\\n}\\\"}\"],\"js\":[\"{\\\"name\\\":\\\"code\\\",\\\"lastModified\\\":1567381492695,\\\"data\\\":\\\"\/*\\\\n$s*$sNew$sproject\\\\n$s*$sv1.0.0\\\\n$s*$sBy$sTODO$sYOUR$sNAME$sHERE\\\\n$s*$smm\/dd\/yyyy\\\\n$s*\/\\\\n\\\\nfunction$sinit()$s{\\\\n\\\\t\/\/$sInit\\\\n}\\\\nif(typeof$sice$s!==$s\\\\\\\"undefined\\\\\\\"$s&&$sice.meta.framework.initialized)$sinit();\\\\n\\\\nfunction$stick(dt)$s{\\\\n\\\\t\/\/$sTick\\\\n}\\\\n\\\\nfunction$srender()$s{\\\\n\\\\t\/\/$sRender\\\\n}\\\"}\"],\"lib\":[\"{\\\"name\\\":\\\"ice\\\",\\\"lastModified\\\":1567381492696,\\\"data\\\":\\\"https:\/\/rebrand.ly\/ice\\\"}\",\"{\\\"name\\\":\\\"ice.framework\\\",\\\"lastModified\\\":1567382816000,\\\"data\\\":\\\"https:\/\/rebrand.ly\/ice-fw\\\"}\"]}}sha256:3b241e5431036a31d9b126fdb6f7df9e21aac88873b64f8cb9986f170f8f5fed";

// Project class
function Project() {
	function getUnusedName(prefix, list) {
		for(let i = 1; i < Infinity; i++) {
			let taken = false;
			if(list instanceof Array) {
				for(let file of list) {
					if(file.name === (prefix + " " + i)) {
						taken = true;
					}
				}
			}
			if(!taken) return prefix + " " + i;
		}
	}
	
	// File class (private to the Project class)
	function File(name, type, project) {
		// function esc(str) {
		// 	return str.replace(/"/g, "\\u0022");
		// }
		
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
		this.session = new ace.createEditSession("", "ace/mode/" + this.aceType);
		this.session.on("change", function() {
			if(isAutoRunCheckboxTicked()) compile(project);
			saveProjectsToLS();
		});
		
		this.generateElem = function() {
			// Create the p elem representing this file
			this.elem = document.createElement("p");
			let textNode = document.createTextNode(this.name);
			this.elem.appendChild(textNode);
			this.elem.classList.add("filesFile");
			this.elem.onclick = () => {
				switchToFile(this);
			};
			this.elem.ondblclick = () => {
				this.elem.classList.add("filesFileEditing");
				this.elem.contentEditable = true;
				this.elem.focus();
			};
			this.elem.onblur = () => {
				this.elem.classList.remove("filesFileEditing");
				this.elem.contentEditable = false;
				this.setName(this.elem.innerText);
				saveProjectsToLS();
			};
			this.elem.onkeydown = (e) => {
				if(e.key === "Enter") {
					this.elem.blur();
				}
			}
		};
		this.generateElem();
		
		this.appendElem = function() {
			elems.files[this.type].div.appendChild(this.elem);
		};
		
		this.removeElem = function() {
			this.elem.remove();
		};
		
		this.setText = function(text) {
			return this.session.setValue(text);
		};
		
		this.getText = function() {
			return this.session.getValue();
		};
		
		this.setName = function(name) {
			if(name.length > 0) this.name = name;
			this.elem.innerText = this.name;
		};

		this.getName = function() {
			return this.name;
		};
		
		this.toString = function() {
			return JSON.stringify({
				name: this.name,
				lastModified: this.lastModified,
				data: this.getText()
			});
		}
	}
	
	this.name = getUnusedName("Project ", projects);
	this.lastModified = new Date().getTime();
	this.files = {
		html: new File("index", "html", this),
		css: [],
		js: [],
		lib: []
	};
	
	this.addCSS = function(appendElem) {
		let name = getUnusedName("style ", this.files.css);
		let newFile = new File(name, "css", this);
		if(appendElem) newFile.appendElem();
		this.files.css.push(newFile);
	};
	
	this.addJS = function(appendElem) {
		let name = getUnusedName("script ", this.files.js);
		let newFile = new File(name, "js", this);
		if(appendElem) newFile.appendElem();
		this.files.js.push(newFile);
	};
	
	this.addLIB = function(appendElem) {
		let name = getUnusedName("library ", this.files.lib);
		let newFile = new File(name, "lib", this);
		if(appendElem) newFile.appendElem();
		this.files.lib.push(newFile);
	};
	
	// Combines the HTML, css, and js into one html string
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
		
		let combinedHTML = "<DOCTYPE html>\n<html lang=\"en\">\n";
		combinedHTML += indent(`${this.files.html.getText()}\n${styles}\n${libs}\n${scripts}`);
		combinedHTML += "\n</html>";
		
		return combinedHTML;
	};
	
	this.appendElems = function() {
		this.files.html.appendElem();
		for(let file of this.files.css) file.appendElem();
		for(let file of this.files.js)  file.appendElem();
		for(let file of this.files.lib) file.appendElem();
	};
	
	this.removeElems = function() {
		this.files.html.removeElem();
		for(let file of this.files.css) file.removeElem();
		for(let file of this.files.js)  file.removeElem();
		for(let file of this.files.lib) file.removeElem();
	};
	
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
		let hash = ice.crypto.sha256(projectString);
		
		return `${projectString}sha256:${hash}`;
	}
}

Project.fromString = function(str) {	
	let projectStr = str.substr(14, str.length - 85);
	let hash = str.substr(str.length - 64, 64);
	let corrupted = false;
	
	// Check the hash to ensure there was no corruption
	if(ice.crypto.sha256("Icebox Project" + projectStr) !== hash) {
		corrupted = true;
		console.warn("Warning! Project hash didn't match... the project may have been corrupted!");
	}
	
	// Parse the project string
	let newProjectData = JSON.parse(projectStr);
	newProjectData.files.html = JSON.parse(newProjectData.files.html);
	newProjectData.files.css  = newProjectData.files.css.map(JSON.parse);
	newProjectData.files.js   = newProjectData.files.js.map(JSON.parse);
	newProjectData.files.lib  = newProjectData.files.lib.map(JSON.parse);
	
	// Build the project
	let newProject = new Project();
	newProject.name = newProjectData.name;
	newProject.lastModified = newProjectData.lastModified;
	
	newProject.files.html.setName(newProjectData.files.html.name);
	newProject.files.html.lastModified = newProjectData.files.html.lastModified;
	newProject.files.html.setText(newProjectData.files.html.data);
	
	for(let i = 0; i < newProjectData.files.css.length; i++) {
		let data = newProjectData.files.css[i];
		newProject.addCSS(false);
		newProject.files.css[i].setName(data.name);
		newProject.files.css[i].lastModified = data.lastModified;
		newProject.files.css[i].setText(data.data);
	}
	
	for(let i = 0; i < newProjectData.files.js.length; i++) {
		let data = newProjectData.files.js[i];
		newProject.addJS(false);
		newProject.files.js[i].setName(data.name);
		newProject.files.js[i].lastModified = data.lastModified;
		newProject.files.js[i].setText(data.data);
	}
	
	for(let i = 0; i < newProjectData.files.lib.length; i++) {
		let data = newProjectData.files.lib[i];
		newProject.addLIB(false);
		newProject.files.lib[i].setName(data.name);
		newProject.files.lib[i].lastModified = data.lastModified;
		newProject.files.lib[i].setText(data.data);
	}
	
	return [newProject, corrupted];
};

// Switches the file in the editor
// Expects a file from a project object (I'm Dr. Seuss apparently)
function switchToFile(file) {
	aceEditor.setSession(file.session);
	aceEditor.session.setUseSoftTabs(false);
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
		
		// stops it from doing that stupid shit with the highlighting
		e.preventDefault();
	}
});

// Stop dragging when mouse is released
document.addEventListener("mouseup", function() {
	isResizerDragging = false;
});

// Escape listener
document.addEventListener("keydown", function(e) {
	if(e.key === "Escape" && popupOpen()) {
		hidePopup();
	}
});

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
	};
	frameWindow.location.reload();
}

function wipeFrame() {
	setFrameCode("Press \"Run\" or ctrl+r to run the project");
}

function compile(project) {
	setFrameCode(project.toCombinedHTML());
}

function loadProject(newProject) {
	if(typeof project !== "undefined") project.removeElems();
	project = newProject;
	project.appendElems();
	switchToFile(project.files.html);
	if(isAutoRunCheckboxTicked()) compile(project);
}

function switchToProject(index) {
	if(index < projects.length) {
		projectIndex = index;
		wipeFrame();
		loadProject(projects[projectIndex]);
		saveProjectsToLS();
	}
	else {
		console.warn("Attempted to switch to a project that doesn't exist!");
	}
}

function showPopup() {
	elems.popup.main.style.display = "block";
}

function hidePopup() {
	elems.popup.main.style.display = "none";
}

function popupOpen() {
	return elems.popup.main.style.display === "block";
}

// Handles the autorun checkbox
function checkboxClicked() {
	let cb = elems.files.autorun.cb;
	
	if(isAutoRunCheckboxTicked()) {
		cb.classList.remove("checked");
	}
	else {
		cb.classList.add("checked");
		compile(project);
	}
}

// Returns whether or not the autorun checkbox is ticked
function isAutoRunCheckboxTicked() {
	return elems.files.autorun.cb.classList.contains("checked");
}

// Handles the run button
function runBtnClicked() {
	compile(project);
}

function generateProjectList() {
	let children = elems.popup.list.children;
	for(let i = children.length - 1; i >= 0; i--) {
		children[i].remove();
	}
	for(let i = 0; i < projects.length; i++) {
		let pElem = document.createElement("p");
		let textNode = document.createTextNode(projects[i].name);
		pElem.appendChild(textNode);
		pElem.onclick = function() {
			projectElemClicked(this, i);
		};
		pElem.ondblclick = function() {
			popupButton("edit");
		};
		pElem.classList.add("popupListElem");
		if(i === projectIndex) pElem.classList.add("selected");
		elems.popup.list.appendChild(pElem);
	}
}

// Manage projects (from/to localstorage, etc...)
function loadProjectsFromLS() {
	let lsProjects = localStorage.getItem("Icebox.projects");
	let lsProjectIndex = localStorage.getItem("Icebox.projectIndex");
	
	// If there are no previously saved projects
	if(lsProjects === null) {
		project = Project.fromString(spaceTabDecode(defaultProjectStr))[0];
		projects = [project];
		projectIndex = 0;
	}
	// If there are previously saved projects
	else {
		// Load them into the projects var
		projects = JSON.parse(lsProjects);
		for(let i = 0; i < projects.length; i++) {
			projects[i] = Project.fromString(projects[i])[0];
		}
		
		// Set our project variables
		projectIndex = lsProjectIndex !== null ? JSON.parse(lsProjectIndex) : 0;
		project = projects[projectIndex];
	}
	switchToProject(projectIndex);
	readyToSaveToLS = true;
}

function projectElemClicked(projectElem, index) {
	let projectElems = elems.popup.list.children;
	for(let i = projectElems.length - 1; i >= 0; i--) {
		projectElems[i].classList.remove("selected");
	}
	
	projectElem.classList.add("selected");
	selectedIndex = index;
}

function spaceTabEncode(str) {
	return str.replace(/\$/g, "$$$$").replace(/ /g, "$$s").replace(/\t/g, "$$t");
}

function spaceTabDecode(str) {
	return str.replace(/\$t/g, "\t").replace(/\$s/g, " ").replace(/\$\$/g, "$$");
}

function popupButton(cmd) {
	let selected = document.getElementsByClassName("selected")[0];
	let selectedProject = projects[selectedIndex];
	
	if(cmd === "add") {
		let newProjectStr = spaceTabDecode(defaultProjectStr);
		let newProject = Project.fromString(newProjectStr)[0];
		projects.push(newProject);
		saveProjectsToLS();
		generateProjectList();
		selectedIndex = projects.length - 1;
		switchToProject(selectedIndex);
	}
	else if(cmd === "edit") {
		switchToProject(selectedIndex);
		hidePopup();
	}
	else if(cmd === "rename") {
		selected.onblur = function() {
			selectedProject.name = selected.innerText;
			saveProjectsToLS();
			generateProjectList();
			selectListElem(selectedIndex);
		};
		selected.onkeydown = function(e) {
			if(e.key === "Enter") {
				this.onblur();
			}
		};
		selected.contentEditable = true;
		selected.focus();
		document.execCommand("selectAll", false, null)
	}
	else if(cmd === "delete") {
		function deleteProj() {
			projects.splice(selectedIndex, 1);
			selectedIndex--;
			saveProjectsToLS();
			generateProjectList();
			
			alert("Project deleted successfully");
		}
		
		let confirmString = `Do you really want to PERMANENTLY DELETE the project "${selectedProject.name}"? There's no going back!\n\nPlease type the project name to confirm.`;
		let confirmResponse = prompt(confirmString);
		
		// Cancelled
		if(confirmResponse === null) {
			alert("The project was not deleted.");
		}
		// Correct project name
		else if(confirmResponse === selectedProject.name) {
			deleteProj();
		}
		// Override key
		else if(confirmResponse === "sudo delete") {
			deleteProj();
		}
		// Incorrect project name
		else {
			alert(`Incorrect project name. The project has not been deleted. If you intended to delete the project, please try again and type the exact project name:\n\n${selectedProject.name}`);
		}
	}
	else if(cmd === "up") {
		if(selectedIndex < projects.length && selectedIndex > 0) {
			let temp = projects[selectedIndex];
			projects[selectedIndex] = projects[selectedIndex - 1];
			projects[selectedIndex - 1] = temp;
			selectedIndex--;
			saveProjectsToLS();
			generateProjectList();
		}
	}
	else if(cmd === "down") {
		if(selectedIndex < projects.length - 1) {
			let temp = projects[selectedIndex];
			projects[selectedIndex] = projects[selectedIndex + 1];
			projects[selectedIndex + 1] = temp;
			selectedIndex++;
			saveProjectsToLS();
			generateProjectList();
		}
	}
	else if(cmd === "upload") {
		let newProjectStr = spaceTabDecode(prompt("Please enter the project code:"));
		let [newProject, corrupted] = Project.fromString(newProjectStr);
		if(corrupted) {
			window.foo = (newProjectStr);
			alert("Warning: The project hash didn't match! The project may have been corrupted.");
		}
		projects.push(newProject);
		saveProjectsToLS();
		generateProjectList();
		selectedIndex = projects.length - 1;
		switchToProject(selectedIndex);
	}
	else if(cmd === "save") {
		let saveStr = spaceTabEncode(selectedProject.toString());
		let temp = document.createElement("textarea");
		temp.appendChild(document.createTextNode(saveStr));
		document.body.appendChild(temp);
		temp.focus();
		temp.select();
		document.execCommand("copy");
		temp.remove();
		alert("Project code copied to clipboard!")
	}
	selectListElem(selectedIndex);
}

function selectListElem(index) {
	let selected = document.getElementsByClassName("selected")[0];
	if(selected !== undefined) selected.classList.remove("selected");
	elems.popup.list.children[index].classList.add("selected");
}

function saveProjectsToLS() {
	if(!readyToSaveToLS) return;
	let lsProjects = [];
	for(let i = 0; i < projects.length; i++) {
		lsProjects.push(projects[i].toString());
	}
	localStorage.setItem("Icebox.projects", JSON.stringify(lsProjects));
	localStorage.setItem("Icebox.projectIndex", JSON.stringify(projectIndex));
}

loadProjectsFromLS();
generateProjectList();
