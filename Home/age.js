// Thanks, naveen from stackoverflow! https://stackoverflow.com/a/7091965
function getAge(dateString) {
	let today = new Date();
	let birthDate = new Date(dateString);
	let age = today.getFullYear() - birthDate.getFullYear();
	let m = today.getMonth() - birthDate.getMonth();
	if(m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
		age--;
	}
	return age;
}

let bday = "5/17/2001";
let myAge = getAge(bday);

let ageElem = document.getElementById("ageText");
ageElem.innerText = myAge + " years old";
