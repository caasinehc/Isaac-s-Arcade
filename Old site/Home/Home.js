var page = "Home"; // Used by seeecret stuff
var birthday = new Date("2001-05-16"); // Actually 5/17/2001, but that would make me age only on the day AFTER my bday.
var now = new Date();
var diff = now - birthday;
var age = new Date(diff).getFullYear() - 1970;
var ageDisplay = document.getElementById("ageDisplay");
ageDisplay.innerHTML = age + " years old";

function havingTrouble() {
  alert("Sorry to hear you are having trouble!\n\nIf inspect element is grayed out or missing, it's likely that your school/office administrators have disabled the option. As annoying as it is, there's not much that can be done about it :/. If you aren't on a school/office managed device (or logged in to a school/office managed google account) it may be a setting in your browser.")
}