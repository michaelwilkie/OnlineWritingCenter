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

  let usertype = $.getUrlVar("usertype");
  let userid = $.getUrlVar("userid");

  console.log(usertype, userid);

  if (usertype == "student") loadStudentView(userid);
  if (usertype == "tutor") loadTutorView(userid);

	function loadStudentView(id) {
		// Navbar
	  $.getJSON("data/student.json", function(data) {
	    $("#welcomeMsg").append("Welcome, student ");
	    data.Students.forEach(function(stu) {
	      if (stu.id == userid)
	        $("#welcomeMsg").append("<a href='#' id='username'>" + stu.fname + " " + stu.lname);
	    })
	    $("#welcomeMsg").append("</a><br />");
	    $("#switchview").text("Switch to Tutor View");
	  })

	  // Load the list of tutors
	  let tutors = [];
	  $.getJSON("data/tutor.json", function(data) { tutors = data.Tutors; })

	  // Load the list of documents
	  let docs = [];
	  $.getJSON("data/document.json", function(data) { docs = data.Documents; })

	  // Left Panel
	  $.getJSON("data/appointment.json", function(data) {
	    if (data.Appointments.length == 0) {
	      $("#appointmentList").append("<p>You do not have any upcoming appointments</p>");

	    } else {
	      let hasAppointment = false;
	      data.Appointments.forEach(function(aptmnt) {
	        hasAppointment = hasAppointment || (aptmnt.studentid == userid);
	      });

	      if (!hasAppointment) {
	        $("#appointmentList").append("<p>You do not have any upcoming appointments</p>");
	      
	      } else {
	        data.Appointments.forEach(function(aptmnt) {
	          if (aptmnt.studentid == userid) {
	            let aptmntHtml = "<div class='card' style='padding: 5px; margin: 10px'>";
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
	            docs.forEach(function(doc) {
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
	  })

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
	  })

	  // Right Panel
	  $.getJSON("data/notification.json", function(data) {
	    console.log(data);
	    data.Notifications.forEach(function(noti) {
	      if (noti.receivertype == usertype && noti.receiverid == userid) {
	        let notiHtml = "<div class='card' style='padding: 5px; margin: 10px'>";
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
	  })
	}

	function loadTutorView(userid) {
    // Navbar
    $.getJSON("data/tutor.json", function(data) {
      $("#welcomeMsg").append("Welcome, tutor ");
      data.Tutors.forEach(function(tut) {
        if (tut.id == userid)
          $("#welcomeMsg").append("<a href='#' id='username'>" + tut.fname + " " + tut.lname);
      })
      $("#welcomeMsg").append("</a><br />");
      $("#switchview").text("Switch to Student View");
    });

    // Load the list of tutors
    let students = [];
    $.getJSON("data/student.json", function(data) { students = data.Students; });

    // Load the list of documents
    let docs = [];
    $.getJSON("data/document.json", function(data) { docs = data.Documents; });

    // Left Panel
    $.getJSON("data/appointment.json", function(data) {
      if (data.Appointments.length == 0) {
        $("#appointmentList").append("<p class='text-center'>You do not have any upcoming appointments</p>");

      } else {
        let hasAppointment = false;
        data.Appointments.forEach(function(aptmnt) {
          hasAppointment = hasAppointment || (aptmnt.tutorid == userid);
        });

        if (!hasAppointment) {
          $("#appointmentList").append("<p class='text-center'>You do not have any upcoming appointments</p>");
        
        } else {
          data.Appointments.forEach(function(aptmnt) {
            if (aptmnt.tutorid == userid) {
              let aptmntHtml = "<div class='card' style='padding: 5px; margin: 10px'>";
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
              docs.forEach(function(doc) {
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
    });

    // Center Panel
    $("#centerCol").append("<div class='text-center'><h3>Requests</h3></div><div id='requestList'></div>");

    
    // Right Panel
    $.getJSON("data/notification.json", function(data) {
      console.log(data);
      data.Notifications.forEach(function(noti) {
        if (noti.receivertype == usertype && noti.receiverid == userid) {
          let notiHtml = "<div class='card' style='padding: 5px; margin: 10px'>";
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
    })
  }
});