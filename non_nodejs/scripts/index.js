$(document).ready(function() {

	// A short jQuery extension to read query parameters from the URL.
	// Adapted from the Candy Crush homework assignment.
	$.extend({
	  getUrlVars: function() {
	    var vars = [], pair;
	    var pairs = window.location.search.substr(1).split('&');
	    console.log(vars);
	    for (var i = 0; i < pairs.length; i++) {
	      pair = pairs[i].split('=');
	      vars.push(pair[0]);
	      vars[pair[0]] = pair[1] &&
	          decodeURIComponent(pair[1].replace(/\+/g, ' '));
	    }
	    return vars;
	  },
	  getUrlVar: function(name) {
	    return $.getUrlVars()[name];
	  }
	});

	let usertype = $.getUrlVar("usertype");
	let userid = $.getUrlVar("userid");

	console.log(usertype, userid);

	if (usertype == "student") {
		loadStudentView(userid);
	} else if (usertype == "tutor") {
		loadTutorView(userid);
	}
});

function loadStudentView(id) {

}

function loadTutorView(id) {
  
}