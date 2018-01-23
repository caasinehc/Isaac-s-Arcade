var page = "SmootherWall"; // Used by seeecret stuff

function gen() {
  document.getElementById("pass").type = "text"; //     It may seem like these two lines do nothing...
  document.getElementById("pass").type = "password"; // But trust me, they needs to be here.
  var user = document.getElementById("user").value;
  var pass = document.getElementById("pass").value;
  var link = document.getElementById("link");
  var myP = document.getElementById("myP");
  var code = 'javascript: (function() {if(this.document.location.href != "https://10.1.0.1:442/login") { this.document.location.href = "https://10.1.0.1:442/login";} else {if (document.readyState === "complete") { document.getElementsByName("USERNAME")[0].value = "' + user + '"; document.getElementsByName("PASSWORD")[0].value = "' + pass + '"; document.getElementsByName("LOGINFORM")[0].submit("LOGINFORM");}}})();' + '// Generated with a tool made by Isaac Chen. Visit rebrand.ly/isaac'
  link.href = code;
  link.style.visibility = "visible";
  myP.style.visibility = "visible";
}