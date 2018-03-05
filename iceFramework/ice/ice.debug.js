if(typeof ice === "undefined") ice = {modules: []};
(function() {
	if(!ice.modules.includes("debug")) ice.modules.push("debug");
	ice.debug = {};
	ice.debug.version = "v2.1.19"; // This version of the ice.debug module
	console.log("%cice.debug " + ice.debug.version + " imported successfully.", "color: #008000");

	/*
	 *	================ Debug Module ================
	 */

	// Properties

	ice.debug.styles = {};
	ice.debug.styles.TITLE = {
		bold: true,
		size: "32px",
		underline: true
	};
	ice.debug.styles.RAINBOW_LINE = {
		padding: "0px 50% 0px 50%",
		size: "2px",
		background: "linear-gradient(to right, #F00, #FF0, #0F0, #0FF, #00F, #F0F)",
		type: "hidden"
	};
	ice.debug.styles.LINE = {
		padding: "0px 50% 0px 50%",
		size: "2px",
		background: "#000000",
		type: "hidden"
	};
	ice.debug.styles.DOTTED_LINE = {
		padding: "0px 50% 0px 50%",
		size: "2px",
		background: "repeating-linear-gradient(to left, black 0px, black 2px, white 2px, white 4px)",
		type: "hidden"
	};
	ice.debug.styles.WARN = {
		background: "#FFFFC0",
		color: "#404040",
		prefix: "\u26A0 "
	};
	ice.debug.styles.ERR = {
		background: "#FFC0C0",
		color: "#400000",
		prefix: "\u2BBF "
	};
	ice.debug.styles.INFO = {
		background: "#C0C0FF",
		color: "#000040",
		prefix: "\u{1F6C8} "
	};
	ice.debug.styles.GREY = {
		color: "#808080"
	};
	ice.debug.styles.RAINBOW = {
		shadow: (
			" \
			1px 1px 0px #FF0000, \
			2px 2px 0px #FF8000, \
			3px 3px 0px #FFFF00, \
			4px 4px 0px #80FF00, \
			5px 5px 0px #00FF00, \
			6px 6px 0px #00FF80, \
			7px 7px 0px #00FFFF, \
			8px 8px 0px #0080FF, \
			9px 9px 0px #0000FF, \
			10px 10px 0px #8000FF, \
			11px 11px 0px #FF00FF, \
			12px 12px 0px #FF0080 \
		"
		),
		color: "transparent"
	}
	ice.debug.styles.DOUBLE_RAINBOW = {
		shadow: (
			" \
			1px 1px 0px #FF0000, \
			2px 2px 0px #FF8000, \
			3px 3px 0px #FFFF00, \
			4px 4px 0px #80FF00, \
			5px 5px 0px #00FF00, \
			6px 6px 0px #00FF80, \
			7px 7px 0px #00FFFF, \
			8px 8px 0px #0080FF, \
			9px 9px 0px #0000FF, \
			10px 10px 0px #8000FF, \
			11px 11px 0px #FF00FF, \
			12px 12px 0px #FF0080, \
			13px 13px 0px #FF0000, \
			14px 14px 0px #FF8000, \
			15px 15px 0px #FFFF00, \
			16px 16px 0px #80FF00, \
			17px 17px 0px #00FF00, \
			18px 18px 0px #00FF80, \
			19px 19px 0px #00FFFF, \
			20px 20px 0px #0080FF, \
			21px 21px 0px #0000FF, \
			22px 22px 0px #8000FF, \
			23px 23px 0px #FF00FF, \
			24px 24px 0px #FF0080 \
		"
		),
		color: "transparent"
	}
	ice.debug.styles.FADE = {
		shadow: (
			" \
			0px 0px 0px #000, \
			1px 1px 0px #111, \
			2px 2px 0px #222, \
			3px 3px 0px #333, \
			4px 4px 0px #444, \
			5px 5px 0px #555, \
			6px 6px 0px #666, \
			7px 7px 0px #777, \
			8px 8px 0px #888, \
			9px 9px 0px #999, \
			10px 10px 0px #AAA, \
			11px 11px 0px #BBB, \
			12px 12px 0px #CCC, \
			13px 13px 0px #DDD, \
			14px 14px 0px #EEE, \
			15px 15px 0px #FFF \
		"
		)
	}

	// Methods

	ice.debug.testFunction = function(func, sampleSize, args, abortTime = 60000) {
		// Stores results
		let results = {};
		// Stores info on results
		let min;
		let max;
		let resultsText = {};
		let totalResults = 0;
		let totalUniqueResults = 0;
		let percent = Math.floor(sampleSize / 100);
		let clearString = Array(100).join("\n");
		let runtime = 0;
		console.clear();
		let before = performance.now();
		// Runs the function [sampleSize] times, incrementing results[(the result)]
		for(let i = 0; i < sampleSize; i++) {
			let result = func.apply(null, args);
			if(typeof results[result] === "undefined") results[result] = 1;
			else results[result]++;
			totalResults++;
			if(i % percent === 0) {
				let perc = i / percent;
				console.log(clearString);
				if(performance.now() - before > abortTime) break;
				console.log(clearString);
				console.log(`%cTest progress: %c${perc}%`, "font-size: 36px; color: #808080", "font-size: 36px; font-weight: bold");
				console.log("%c", `background: linear-gradient(to right, black ${perc}%, rgba(0, 0, 0, 0.5) ${perc}%); padding: 0px 50%; border: 2px solid black;`);
			}
		}
		let after = performance.now();
		console.clear();
		// loops through results, noting important values and adding percentage information
		for(let key in results) {
			if(typeof min === "undefined") {
				min = key;
				max = key
			}
			if(results[key] < results[min]) {
				min = key;
			}
			if(results[key] > results[max]) {
				max = key;
			}
			totalUniqueResults++;
			resultsText[key] = results[key] + " (" + ((results[key] / sampleSize) * 100).toFixed(2) + "%)";
		}
		let totalSeconds = (after - before) / 1000;
		let totalTime = "";
		if(totalSeconds >= 60) totalTime += Math.floor(totalSeconds / 60) + " Minutes, ";
		totalTime += totalSeconds.toFixed(4) % 60 + " Seconds";
		// The information to be returned
		let returnObject = {
			"Function tested": func.toString(),
			"Target sample size": sampleSize,
			"Actual sample size": totalResults,
			"Total unique results": totalUniqueResults,
			"Total time": totalTime,
			// Interesting facts from wikipedia:
			// 1.016703362164 nanoseconds – 1 light foot.
			// 0.330 nanoseconds – The time it takes a common 3.0 GHz CPU to add two integers
			// approx 1 million nanoseconds - The average duration of a camera flash.
			"Average time": (1000000 * (after - before) / totalResults).toFixed(4) + " nanoseconds",
			"Expected frequency (assuming even distribution)": totalResults / totalUniqueResults + "(" + (100 / totalUniqueResults).toFixed(2) + "%)",
			"Most common": max + ", occuring a whopping " + results[max] + " times (" + ((results[max] / totalResults) * 100).toFixed(2) + "%)",
			"Least common": min + ", occuring only " + results[min] + " times (" + ((results[min] / totalResults) * 100).toFixed(2) + "%)"
		}
		console.table(returnObject);
		console.groupCollapsed("Results");
		console.table(resultsText);
		console.groupEnd();
		returnObject["Results"] = resultsText;
		return returnObject;
	}

	// Very similar to testFunction, but much more accurate timing (also way slower, usually about 1/10th as fast)
	ice.debug.benchmark = function(func, sampleSize, args, abortTime = 60000) {
		// Stores info on results
		let totalResults = 0;
		let percent = Math.floor(sampleSize / 100);
		let clearString = Array(100).join("\n");
		let runtime = 0;
		console.clear();
		let before = performance.now();
		// Runs the function [sampleSize] times, incrementing results[(the result)]
		for(let i = 0; i < sampleSize; i++) {
			let beforeCall = performance.now();
			let result = func.apply(null, args);
			let afterCall = performance.now();
			runtime += afterCall - beforeCall;
			totalResults++;
			if(afterCall - before > abortTime) {
				console.log(clearString);
				console.log("%cAborting!%c progress: %c" + Math.floor(i / percent) + "%", "font-size: 36px; color: #FF0000", "font-size: 36px; color: #808080", "font-size: 36px; font-weight: bold");
				break;
			}
			if(i % percent === 0) {
				let perc = i / percent;
				console.log(clearString);
				console.log(`%cTest progress: %c${perc}%`, "font-size: 36px; color: #808080", "font-size: 36px; font-weight: bold");
				console.log("%c", `background: linear-gradient(to right, black ${perc}%, rgba(0, 0, 0, 0.5) ${perc}%); padding: 0px 50%;`);
			}
		}
		let after = performance.now();
		console.clear();
		let totalSeconds = (after - before) / 1000;
		let totalTime = "";
		if(totalSeconds >= 60) totalTime += Math.floor(totalSeconds / 60) + (Math.floor(totalSeconds / 60) > 1 ? " Minutes, " : " Minute, ");
		totalTime += totalSeconds.toFixed(4) % 60 + " Seconds";
		let runtimeSeconds = runtime / 1000;
		let runtimeText = "";
		if(runtimeSeconds >= 60) runtimeText += Math.floor(runtimeSeconds / 60) + (Math.floor(runtimeSeconds / 60) > 1 ? " Minutes, " : " Minute, ");
		runtimeText += runtimeSeconds.toFixed(4) % 60 + " Seconds";
		// The information to be returned
		let returnObject = {
			"Function tested": func.toString(),
			"Target sample size": sampleSize,
			"Actual sample size": totalResults,
			"Total time": totalTime,
			"Total call time": runtimeText,
			"Average time": ((runtime / totalResults) * 1000000).toFixed(4) + " nanoseconds"
		}
		console.table(returnObject);
		return returnObject;
	}
	ice.debug.aval = function(code, abortTime = 60000) {
		return new Promise(function(resolve, reject) {
			if(typeof code === "string") code = `(function() {${code}})`;

			let blob = new Blob([`onmessage = function() {postMessage(${code}());}`]);
			let worker = new Worker(URL.createObjectURL(blob));
			let timer = setTimeout(function() {
				worker.terminate();
				reject("TIMEOUT");
			}, abortTime);

			worker.onmessage = function(e) {
				clearTimeout(timer);
				worker.terminate();
				resolve(e.data);
			}
			worker.onerror = function(e) {
				reject(e.message);
			}
			worker.postMessage("START");
		});
	}

	ice.debug.log = function(text, style, style2) {
		if(typeof style === "string") console.log("%c" + text, style);
		else if(typeof style === "object") {
			if(typeof style2 === "object") style = Object.assign(Object.assign({}, style), style2);
			let css = "";
			if(style.color !== undefined) css += "color: " + style.color + ";";
			if(style.bold) css += "font-weight: bold;";
			if(style.underline || style.overline || style.strike) css += "text-decoration:";
			if(style.underline) css += " underline";
			if(style.overline) css += " overline";
			if(style.strike) css += " strike";
			if(style.underline || style.overline || style.strike) css += ";";
			if(style.italic) css += "font-style: italic;";
			if(style.line_height !== undefined) css += "line-height: " + style.line_height + ";";
			if(style.background !== undefined) css += "background: " + style.background + ";";
			if(style.font !== undefined) css += "font-family: " + style.font + ";";
			if(style.size !== undefined) css += "font-size: " + style.size + ";";
			if(style.border_style === undefined && (
					style.border_width !== undefined ||
					style.border_color !== undefined ||
					style.border_radius !== undefined
				)) {
				css += "border-style: solid;";
			}
			else if(style.border_style !== undefined) css += "border-style: " + style.border_style + ";";
			if(style.border_width !== undefined) css += "border-width: " + style.border_width + ";";
			if(style.border_color !== undefined) css += "border-color: " + style.border_color + ";";
			if(style.border_radius !== undefined) css += "border-radius: " + style.border_radius + ";";
			if(style.margin !== undefined) css += "margin: " + style.margin + ";";
			if(style.padding !== undefined) css += "padding: " + style.padding + ";";
			if(style.shadow !== undefined) css += "text-shadow: " + style.shadow + ";";
			if(style.prefix !== undefined) text = style.prefix + text;
			if(style.suffix !== undefined) text = text + style.suffix;

			if(style.type === "error") console.error("%c" + text, css);
			else if(style.type === "warning" || style.type === "warn") console.warn("%c" + text, css);
			else if(style.type === "info") console.info("%c" + text, css);
			else if(style.type === "debug") console.debug("%c" + text, css);
			else if(style.type === "hidden") console.log("%c", css);
			else console.log("%c" + text, css);
		}
	}

	// function logCanvas(ctx) {
	// 	console.log("\n");
	// 	let canvas = ctx.canvas;
	// 	var lineHeight = 19;
	// 	var width = canvas.width;
	// 	var height = canvas.height;
	// 	var data = ctx.getImageData(0, 0, width, height).data;
	// 	function getPixel(x, y) {
	// 		let i = (x + y * width) * 4;
	// 		return ice.colors.rgbToHex(data[i], data[i + 1], data[i + 2], data[i + 3]);
	//     }
	// 	for(let i = 0; i < height / lineHeight; i++) {
	// 		var args = [Array(width + 1).join("%c")];
	// 		for(let j = 0; j < width; j++) {
	// 			var grad = "linear-gradient(to bottom";
	// 			for(let k = 0; k < lineHeight; k++) {
	// 				let color = getPixel(j, (i * lineHeight) + k);
	// 				grad += `, ${color} ${k}px, ${color} ${k + 1}px`;
	// 			}
	// 			grad += ")"
	// 			args.push(
	// `background: ${grad};
	// padding: ${lineHeight}px 1px 0px 0px;
	// font-size: 0px;`
	// 			);
	// 		}
	// 		args[0] += `%c${i}`;
	// 		args.push("font-size: 0px");
	// 		console.log.apply(null, args);
	// 	}
	// }
	ice.debug.logImage = function(src) {
		if(src instanceof HTMLCanvasElement) src = src.toDataURL();
		else if(src instanceof CanvasRenderingContext2D) src = src.canvas.toDataURL();

		let img = new Image();
		img.onload = function() {
			let padW = Math.floor(this.width / 2);
			let padH = Math.floor(this.height / 2);
			console.log(
				"%c",
				`font-size: 0px;padding: ${padH}px ${padW}px;line-height: ${this.height}px;background: url(${src});`
			);
		}
		img.src = src;
	}

	ice.debug.summonDebugDoug = function() {
		let debugDougWindow = window.open("", "debugdoug", "width=405 height=380");
		debugDougWindow.document.write("<title>Debug Doug</title>");
		debugDougWindow.document.write(
			"<pre>" +
			"/* * * * * * * * * * * * * * * * * * * * * * * * * * *\\" + "<br />" +
			" *                                                   *" + "<br />" +
			" *  ___      _                ___                _   *" + "<br />" +
			" * |   \\ ___| |__ _  _ __ _  |   \\ ___ _  _ __ _(_)  *" + "<br />" +
			" * | |) / -_| '_ | || / _` | | |) / _ | || / _` |_   *" + "<br />" +
			" * |___/\\___|_.__/\\_,_\\__, | |___/\\___/\\_,_\\__, (_)  *" + "<br />" +
			" *                    |___/                |___/     *" + "<br />" +
			" *                                                   *" + "<br />" +
			" *                                                   *" + "<br />" +
			" *                           ..---..                 *" + "<br />" +
			" *                         .`    _  '.               *" + "<br />" +
			" *                         :    (o)  '..___          *" + "<br />" +
			" *                         ;          __..'          *" + "<br />" +
			" *                          \\       .`               *" + "<br />" +
			" *                ___...---..`      ;                *" + "<br />" +
			" *       ('-. .-~`                   '.              *" + "<br />" +
			" *        '._ '                 ;      '.            *" + "<br />" +
			" *          :       ;       ,,,;:       :            *" + "<br />" +
			" *~~~~~~~~~~'        \"\"\"\"\"\"\"'           /~~~~~~~~~~~~*" + "<br />" +
			" * ~~~       ;                         +   ~~~     ~~*" + "<br />" +
			" *      ~~    \'._                   _.`     ~~~      *" + "<br />" +
			" *  ~~~     ~    \'~---...___....--~`   ~~~           *" + "<br />" +
			" *                                               ~~  *" + "<br />" +
			"\\* * * * * * * * * * * * * * * * * * * * * * * * * * */" +
			"</pre>"
		);
		debugDougWindow.document.write(
			"<style>" +
			"pre {" +
			"position: absolute;" +
			"top: 0;" +
			"left: 0;" +
			"word-wrap: normal;" +
			"white-space: pre-wrap;" +
			"width: 400;" +
			"height: 350;" +
			"}" +
			"</style>"
		);
		debugDougWindow.document.write(
			"<script>" +
			"window.onclick = function() {" +
			"window.resizeTo(421, 446);" +
			"}" +
			"</script>"
		);
	}
})();
