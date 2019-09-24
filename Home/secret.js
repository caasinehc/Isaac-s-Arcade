var secret = (function() {
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
	
	let db = {
		// "trig"
		"64053ca7ee3fcd9c4a32202ea1d04ef3cec0fdf183e5cfca9c09291ba17d3f20": function() {
			let link = document.createElement("a");
			link.href = `javascript:((t,c)=>t[c]=[]+t[c]!==!0+[])(document.querySelector(".datadisplaytable"),"contentEditable");`;
			link.innerText = "FMod by Isaac Chen";
			document.body.appendChild(link);
        	}
	};
	return function() {
		let userInput = prompt("Please enter a key:");
		let hashed = sha256(userInput);

		if(db[hashed] !== undefined && typeof db[hashed] === "function") {
			db[hashed]();
        }
    }
})();

var secretKeyPress = (function() {
	let secretString = "secret";
	return function(e) {
		if(e.key.length !== 1) return;
		let newChar = e.key.toLowerCase();
		secretString = secretString.substr(1) + newChar;
		
		if(secretString === "secret") secret();
	}
})();

let secretListener = document.addEventListener("keydown", secretKeyPress);
