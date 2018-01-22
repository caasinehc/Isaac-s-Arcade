(function() {
	let navbarLayout = {
		home: "../Home/Home.html",
		games: {
			game1: "javascript: alert('game1 clicked!');",
			game2: "javascript: alert('game2 clicked!');",
			game3: "javascript: alert('game3 clicked!');"
		},
		random: {
			random1: "javascript: alert('random1 clicked!');",
			random2: "javascript: alert('random2 clicked!');",
			random3: "javascript: alert('random3 clicked!');"
		}
	};
	let styles = {
		border: "1px solid #FFFFFF",
		width: 16,
		height: 12,
		background: "#202020",
		color: "#FFFFFF",
		bold: true,
		size: 16,
		hover: {
			background: "#000000",
			color: "#FFFFFF"
		},
		active: {
			background: "#FFFFFF",
			color: "#000000"
		},
		dropdown: {
			width: 160,
			align: "center"
		}
	};
	let thisScript = document.currentScript;
	let navbarDiv = document.createElement("div");
	navbarDiv.classList.add("navbar");
	let navbar = document.createElement("ul");
	let style = document.createElement("style");
	style.type = "text/css";
	style.innerHTML = (
		// NAVBAR
		".navbar ul {\n" +
		"	list-style-type: none;\n" + // no bullets
		"	margin: 0px;\n" +
		"	padding: 0px;\n" +
		"	overflow: hidden;\n" +
		"	background: " + styles.background + ";\n" +
		"	border: " + styles.border + ";\n" +
		"}\n" +
		// NAVBAR BUTTONS
		".navbar li {\n" +
		"	float: left;\n" +
		"}\n" +

		// LINKS
		".navbar li a {\n" +
		"	display: inline-block;\n" + // spacing
		"	color: " + styles.color + ";\n" +
		"	font-weight: " + (styles.bold ? "bold" : "normal") + ";\n" +
		"	font-size: " + styles.size + "px;\n" +
		"	padding: " + styles.height + "px " + styles.width + "px;\n" +
		"	text-decoration: none;\n" + // removes underline
		"}\n" +
		// LINKS ON HOVER, DROPDOWN BUTTON WHILE IN DROPDOWN
		".navbar li a:hover, .navbar li:hover .dropdownLink {\n" +
		"	background: " + styles.hover.background + ";\n" +
		"	color: " + styles.hover.color + ";\n" +
		"}\n" +

		// LINKS WHEN ACTIVE, DROPDOWN BUTTON WHEN DROPDOWN ACTIVE
		".navbar li a.active, .navbar li.active .dropdownLink {\n" +
		"	background: " + styles.active.background + ";\n" +
		"	color: " + styles.active.color + ";\n" +
		"}\n" +

		// DROPDOWN
		".navbar li div {\n" +
		"	display: none;\n" + // Hidden by default
		"	position: absolute;\n" + // positions correctly
		"	background: " + styles.background + ";\n" +
		"	border: " + styles.border + ";\n" +
		"	border-top: none;\n" + // removes top part of border
		"	min-width: " + styles.dropdown.width + "px;\n" +
		"	z-index: 1;\n" + // keeps dropdown above everything else
		"}\n" +
		// DROPDOWN ON DROPDOWN BUTTON HOVER
		".navbar li:hover div {\n" +
		"	display: block;\n" + // show yourself!
		"}\n" +

		// DROPDOWN LINKS
		".navbar li div a {\n" +
		"	display: block;\n" + // stacks links vertically
		"	text-align: " + styles.dropdown.align + ";\n" +
		"}"
	)
	for(let key of Object.keys(navbarLayout)) {
		let list = document.createElement("li");
		let link = document.createElement("a");
		link.innerText = key;
		list.appendChild(link);
		if(typeof navbarLayout[key] === "string") {
			link.href = navbarLayout[key];
		}
		else {
			link.href = "javascript: void(0);";
			link.classList.add("dropdownLink");
			// Dropdown content
			let contentDiv = document.createElement("div");
			for(let key2 of Object.keys(navbarLayout[key])) {
				let link2 = document.createElement("a");
				link2.href = navbarLayout[key][key2];
				link2.innerText = key2;
				contentDiv.appendChild(link2);
			}
			list.appendChild(contentDiv);
		}
		navbar.appendChild(list);
	}
	navbarDiv.appendChild(style);
	navbarDiv.appendChild(navbar);
	thisScript.parentElement.replaceChild(navbarDiv, thisScript);
})();
