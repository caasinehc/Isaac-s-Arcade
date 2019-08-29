let aceEditor = ace.edit("editor");
aceEditor.setTheme("ace/theme/monokai");
aceEditor.setTheme("ace/theme/monokai"); // Automatically loaded, just pass a string
aceEditor.setFontSize(16);
// aceEditor.resize(); // Updates the ace size
aceEditor.session.setMode("ace/mode/javascript");

// Elements on the page
let elems = {};
elems.icebox  = document.getElementById("icebox");
elems.editor  = document.getElementById("editor");
elems.resizer = document.getElementById("resizer");
elems.frame   = document.getElementById("frame");

// Island of misfit variables
let isRisizerDragging;

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
		let containerOffsetLeft = elems.icebox.offsetLeft;
		let pointerRelativeXpos = e.clientX - containerOffsetLeft;
		
		let minWidth = 100;
		let newWidth = (Math.min(Math.max(minWidth, pointerRelativeXpos - 8), elems.icebox.clientWidth - minWidth));
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

setFrameCode(
`<html>
	<body>
		<h1>This is my header!</h1>
		<p>This is my paragraph.</p>
	</body>
</html>`);