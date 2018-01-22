(function() {
	let styles = {
		navbar: (
			"list-style-type: none;" +
			"margin: 0;" +
			"padding: 0;" +
			"overflow: hidden;" +
			"background-color: #000000;"
		),
		li: (
			"float: left"
		),
		link: (
			"display: inline-block;" +
			"color: white;" +
			"text-align: center;" +
			"padding: 14px 16px;" +
			"text-decoration: none;"
		)
	}
	let thisScript = document.currentScript;
	let navbar = document.createElement("ul");
	navbar.style = styles.navbar;
	let navbarLayout = {
		home: "../Home/Home.html",
		games: {
			game1: "javascript: alert('game1 clicked!');",
			game2: "javascript: alert('game2 clicked!');",
			game3: "javascript: alert('game3 clicked!');"
		}
	}
	for(let key of Object.keys(navbarLayout)) {
		if(typeof navbarLayout[key] === "string") {
			let list = document.createElement("li");
			list.style = styles.list;
			let link = document.createElement("a");
			link.style = styles.link;
			link.href = navbarLayout[key];
			link.innerText = key;
			list.appendChild(link);
			navbar.appendChild(list);
		}
		else {
			let list = document.createElement("li");
			list.style = styles.list;
			list.style = styles.link;
			// Dropdown button
			let link = document.createElement("a");
			link.style = styles.link;
			link.href = "javascript: void(0);";
			link.classList.add("dropdownLink");
			list.appendChild(link);
			// Dropdown content
			let contentDiv = document.createElement("div");
			contentDiv.classList.add("dropdownContent");
			for(let key2 of Object.keys(navbarLayout[key])) {
				let link = document.createElement("a");
				link.href = navbarLayout[key][key2];
				link.innerText = key2;
				contentDiv.appendChild(link);
			}
			list.appendChild(contentDiv);
			navbar.appendChild(list);
		}
	}
	thisScript.parentElement.replaceChild(navbar, thisScript);
})();
