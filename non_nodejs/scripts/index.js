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

function loadCenter(buttonid = null)
{
	switch(buttonid)
	{
		case "tutorsearch":
		
		$("#centerCol").empty();
		$("#centerCol").append("<div class='col-xs-6 middle'>");
			$("#centerCol").append("<div class='text-center' style='background-color:darkcyan; color:white;'>");
				$("#centerCol").append("<h3>Avaliable Tutors</h3>");
            $("#centerCol").append("</div>");

            $("#centerCol").append("<div style='padding-left: 15px;'>");
                
				$("#centerCol").append("<input id='searchbar' type='text' placeholder='Search' style='background-color:light-gray;padding: 5px;'/>");
                
            $("#centerCol").append('</div>');

			$("#centerCol").append("<div class='tutor' id='tutors'>");
				//<!-- to be filled by search.js -->
			$("#centerCol").append("</div>");
            
            
		$("#centerCol").append("</div>");
		drawTables();
			
			
			break;
		
		default:
	// Center Panel
      $("#centerCol").append("<div class='text-center'><h3>Your Documents</h3></div><div id='documentList'></div>");

      $.getJSON("data/document.json", function(data) {
        
        if (data.Documents.length == 0) {
          $("#documentList").append("<p>You have not shared any document yet</p>");
          $("#documentList").append("<div class='text-center' style='margin-top: 20px'><input class='btn' type='button' value='Share a new document' onclick='' /></div>");

        } else {
          let ownDocs = false;
          data.Documents.forEach(function(doc) {
            ownDocs = ownDocs || (doc.studentid == userid);
          });

          if (!ownDocs) {
            $("#documentList").append("<p class='text-center'>You have not shared any document yet</p>");
            $("#documentList").append("<div class='text-center' style='margin-top: 20px'><input class='btn' type='button' value='Share a new document' onclick='' /></div>");

          
          } else {
            $("#documentList").append("<table class='table'><tbody>");
            data.Documents.forEach(function(doc) {
              if (doc.studentid == userid) {
                $("#documentList").append("<tr class='row col-sm-12'>");
                $("#documentList").append("<td class='col-sm-6'>" + doc.title + "</td>");
                $("#documentList").append("<td class='col-sm-3'><input class='btn btn-doc-action' type='button' value='Open in a new tab' onclick='window.open(\x22" + doc.url + "\x22)' /></td>");
                $("#documentList").append("<td class='col-sm-3'><input class='btn btn-doc-action' type='button' value='Request a review' onclick='' /></td>");
                $("#documentList").append("</tr>");
              }
            });
            $("#documentList").append("</tbody></table>");
            $("#documentList").append("<div class='text-center' style='margin-top: 20px'><input class='btn' type='button' value='Share a new document' onclick='' /></div>");

          }
        }
      });
	}// switch case
}

function loadTutorView(id) {
  
}