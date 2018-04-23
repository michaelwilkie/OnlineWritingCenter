$(document).ready(function() {
	// A short jQuery extension to read query parameters from the URL.
  // Referenced from the Candy Crush homework assignment.
  $.extend({
    getUrlVars: function() {
      var vars = [], pair;
      var pairs = window.location.search.substr(1).split('&');
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
  })

  var usertype = $.getUrlVar("usertype");
  var userid = $.getUrlVar("userid");

  // Data
  var students = [];
  var tutors = [];
  var documents = [];
  var notifications = [];
  var appointments = [];

  loadAllData();
  loadHomepage();
  console.log(students, tutors, documents, notifications, appointments);
  if (usertype == "student") loadStudentView(userid);
  if (usertype == "tutor") loadTutorView(userid);

  function loadAllData() {
  	/*
  	$.getJSON("data/student.json", function(data) { students = data.Students; });
  	$.getJSON("data/tutor.json", function(data) { tutors = data.Tutors; });
  	$.getJSON("data/document.json", function(data) { documents = data.Documents; });
  	$.getJSON("data/notification.json", function(data) { notifications = data.Notifications; });
  	$.getJSON("data/appointment.json", function(data) { appointments = data.Appointments; });
  	*/

  	// Load data synchronously. Note that this method is deprecated by jquery
  	// and I don't know any alternative.
  	$.ajax({
		  url: 'data/student.json',
		  async: false,
		  dataType: 'json',
		  success: function (data) { students = data.Students; }
		});

		$.ajax({
		  url: 'data/tutor.json',
		  async: false,
		  dataType: 'json',
		  success: function (data) { tutors = data.Tutors; }
		});

		$.ajax({
		  url: 'data/document.json',
		  async: false,
		  dataType: 'json',
		  success: function (data) { documents = data.Documents; }
		});

		$.ajax({
		  url: 'data/notification.json',
		  async: false,
		  dataType: 'json',
		  success: function (data) { notifications = data.Notifications; }
		});

		$.ajax({
		  url: 'data/appointment.json',
		  async: false,
		  dataType: 'json',
		  success: function (data) { appointments = data.Appointments; }
		});
  }

  function loadHomepage() {
  	// Navigation bar
  	var navbarHtml = "<a class='navbar-brand' href='index.html?usertype=" + usertype + "&userid=" + userid + "'><h2>Online Writing Center</h2></a>";
  	navbarHtml += "<button class='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation'><span class='navbar-toggler-icon'></span></button>";
  	navbarHtml += "<div class='collapse navbar-collapse' id='navbarSupportedContent'>";
  	navbarHtml += "<ul class='navbar-nav mr-auto' style='display: table; margin-top: auto; margin-bottom: auto' id='pageList'>";
  	navbarHtml += "<li class='nav-item active' style='vertical-align: middle; display: table-cell'><a class='nav-link' href='index.html?usertype=" + usertype +"&userid=" + userid + "'>Home <span class='sr-only'>(current)</span></a></li>";
  	navbarHtml += "</ul>";
  	navbarHtml += "<div class='d-inline-block pull-right'><p class='text-right'><span id='welcomeMsg'></span><a href='#' id='switchview'>Switch to Tutor View</a> | <a href='#'' id='signout'>Sign out</a></p></div>";
  	navbarHtml += "</div>";
  	$("#navbar").html(navbarHtml);

  	// Left column
  	var leftColHtml = "<div class='text-center'><h3>Schedule</h3></div>";
  	leftColHtml += "<div class='text-center'>Upcoming appointments:</div>";
  	leftColHtml += "<div id='appointmentList'></div>";
  	$("#leftCol").html(leftColHtml);

  	// Center column

  	// Right column
  	var rightColHtml = "<div class='text-center'><h3>Notifications</h3></div><div id='notificationList'></div>";
  	$("#rightCol").html(rightColHtml);
  }

	function loadStudentView(id) {
		modifyNavbar();

	  // Left Panel
    if (appointments.length == 0) {
      $("#appointmentList").append("<p>You do not have any upcoming appointments</p>");

    } else {
      var hasAppointment = false;
      appointments.forEach(function(aptmnt) {
        hasAppointment = hasAppointment || (aptmnt.studentid == userid);
      });

      if (!hasAppointment) {
        $("#appointmentList").append("<p>You do not have any upcoming appointments</p>");
      
      } else {
        appointments.forEach(function(aptmnt) {
          if (aptmnt.studentid == userid) {
            var aptmntHtml = "<div class='card' style='padding: 5px; margin: 10px'>";
            aptmntHtml += "<div class='card-body'>";
            aptmntHtml += "<p class='card-subtitle mb-2 text-muted'><small>"
            aptmntHtml += aptmnt.datetime;
            aptmntHtml += "</small></p>";
            aptmntHtml += "<p class='card-text text-left'>";
            
            aptmntHtml += "Meet tutor <a href='#'>";
            tutors.forEach(function(tut) {
              if (tut.id == aptmnt.tutorid) 
                aptmntHtml += tut.fname + " " + tut.lname + "</a>";
            });
            
            aptmntHtml += " to review the document ";
            documents.forEach(function(doc) {
              if (doc.id == aptmnt.fileid) {
                aptmntHtml += "<a href='" + doc.url + "'>";
                aptmntHtml += doc.title + "</a>";
              }
            });

            aptmntHtml += "</p></div></div>";
            $("#appointmentList").append(aptmntHtml);
          }
        });
      }
    }

    $("#leftCol").append("<div class='text-center'><form action='#'><input id='schedulebutton' class='btn' type='submit' value='Make new appointment' /></form></div>");

	  // Center Panel
	  $("#centerCol").append("<div class='text-center'><h3>Your Documents</h3></div><div id='documentList'></div>");
	    
    if (documents.length == 0) {
      $("#documentList").append("<p>You have not shared any document yet</p>");
      $("#documentList").append("<div class='text-center' style='margin-top: 20px'><input class='btn' type='button' value='Share a new document' onclick='' /></div>");

    } else {
      var ownDocs = false;
      documents.forEach(function(doc) {
        ownDocs = ownDocs || (doc.studentid == userid);
      });

      if (!ownDocs) {
        $("#documentList").append("<p class='text-center'>You have not shared any document yet</p>");
        $("#documentList").append("<div class='text-center' style='margin-top: 20px'><input class='btn' type='button' value='Share a new document' onclick='' /></div>");

      
      } else {
        $("#documentList").append("<table class='table'><tbody>");
        documents.forEach(function(doc) {
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

	  // Right Panel
	  if (notifications.length == 0) {
      $("#notificationList").append("<p class='text-center'>There is no notification.</p>");

    } else {
    	var hasNoti = false;
    	notifications.forEach(function(noti) {
    		hasNoti = hasNoti || (noti.receivertype == usertype && noti.receiverid == userid);
    	});

    	if (!hasNoti) {
    		$("#notificationList").append("<p class='text-center'>There is no notification.</p>");
    		
    	} else {
    		notifications.forEach(function(noti) {
		      if (noti.receivertype == usertype && noti.receiverid == userid) {
		        var notiHtml = "<div class='card' style='padding: 5px; margin: 10px'>";
		        notiHtml += "<div class='card-body'>";
		        notiHtml += "<p class='card-subtitle mb-2 text-muted'><small>"
		        notiHtml += noti.timestamp;
		        notiHtml += "</small></p>";
		        notiHtml += "<p class='card-text text-left'>";

		        switch(noti.type) {
		          case "file change":
		            notiHtml += "Tutor <a href='#'>";
		            tutors.forEach(function(tut) {
		              if (tut.id == noti.senderid) {
		                notiHtml += tut.fname + " " + tut.lname;    
		              }
		            })
		            notiHtml += "</a> has made changes to your file.";
		            break;

		          case "request":
		            break;
		          
		          case "response":  // Response
		            notiHtml += "Tutor <a href='#'>";
		            tutors.forEach(function(tut) {
		              if (tut.id == noti.senderid) {
		                notiHtml += tut.fname + " " + tut.lname;    
		              }
		            })
		            notiHtml += "</a> has accepted your appointment request.";
		            break;
		          
		          default:  // Nothing
		            break;
		        }

		        notiHtml += "</p></div></div>";
		        $("#notificationList").append(notiHtml);
		      }
		    });
    	}
	  }

    function modifyNavbar() {
			// Navbar
	    $("#welcomeMsg").append("Welcome, student ");
	    students.forEach(function(stu) {
	      if (stu.id == userid)
	        $("#welcomeMsg").append("<a href='#' id='username'>" + stu.fname + " " + stu.lname);
	    })
	    $("#welcomeMsg").append("</a><br />");
	    
	    $("#switchview").text("Switch to Tutor View");
	    
	    $("#navbarSupportedContent ul").append("<li class='nav-item active' style='vertical-align: middle; display: table-cell'><a class='nav-link' href='index.html'>Tutor List <span class='sr-only'>(current)</span></a></li>");
		};
	}

	function loadTutorView(userid) {
    modifyNavbar();

    // Left Panel
    if (appointments.length == 0) {
      $("#appointmentList").append("<p class='text-center'>You do not have any upcoming appointments</p>");

    } else {
      var hasAppointment = false;
      appointments.forEach(function(aptmnt) {
        hasAppointment = hasAppointment || (aptmnt.tutorid == userid);
      });

      if (!hasAppointment) {
        $("#appointmentList").append("<p class='text-center'>You do not have any upcoming appointments</p>");
      
      } else {
        appointments.forEach(function(aptmnt) {
          if (aptmnt.tutorid == userid) {
            var aptmntHtml = "<div class='card' style='padding: 5px; margin: 10px'>";
            aptmntHtml += "<div class='card-body'>";
            aptmntHtml += "<p class='card-subtitle mb-2 text-muted'><small>"
            aptmntHtml += aptmnt.datetime;
            aptmntHtml += "</small></p>";
            aptmntHtml += "<p class='card-text text-left'>";
            
            aptmntHtml += "Meet student <a href='#'>";
            students.forEach(function(stu) {
              if (stu.id == aptmnt.studentid) 
                aptmntHtml += stu.fname + " " + stu.lname + "</a>";
            });
            
            aptmntHtml += " to review the document ";
            documents.forEach(function(doc) {
              if (doc.id == aptmnt.fileid) {
                aptmntHtml += "<a href='" + doc.url + "'>";
                aptmntHtml += doc.title + "</a>";
              }
            });

            aptmntHtml += "</p></div></div>";
            $("#appointmentList").append(aptmntHtml);
          }
        });
      }
    }

    // Center Panel
    $("#centerCol").append("<div class='text-center'><h3>Requests</h3></div><div id='requestList'></div>");

    // Right Panel
    notifications.forEach(function(noti) {
      if (noti.receivertype == usertype && noti.receiverid == userid) {
        var notiHtml = "<div class='card' style='padding: 5px; margin: 10px'>";
        notiHtml += "<div class='card-body'>";
        notiHtml += "<p class='card-subtitle mb-2 text-muted'><small>"
        notiHtml += noti.timestamp;
        notiHtml += "</small></p>";
        notiHtml += "<p class='card-text text-left'>";

        switch(noti.type) {
          case "file change":
            break;

          case "request":
            notiHtml += "Student <a href=''>";
            students.forEach(function(stu) {
              if (stu.id == noti.senderid) {
                notiHtml += stu.fname + " " + stu.lname;    
              }
            })
            notiHtml += "</a> has made an appointment with you.";
            notiHtml += "<br /><br /><small><a href=''>View details</a></small>"
            break;
          
          case "response":  // Response
            notiHtml += "Student <a href='#'>";
            students.forEach(function(stu) {
              if (stu.id == noti.senderid) {
                notiHtml += stu.fname + " " + stu.lname;    
              }
            })
            notiHtml += "</a> has accepted your appointment request.";
            break;
          
          default:  // Nothing
            break;
        }

        notiHtml += "</p></div></div>";
        $("#notificationList").append(notiHtml);
      }
    });
  }

  function modifyNavbar() {
  	// Navbar
    $("#welcomeMsg").append("Welcome, tutor ");
    tutors.forEach(function(tut) {
      if (tut.id == userid)
        $("#welcomeMsg").append("<a href='#' id='username'>" + tut.fname + " " + tut.lname);
    })
    $("#welcomeMsg").append("</a><br />");
    $("#switchview").text("Switch to Student View");
  }
});