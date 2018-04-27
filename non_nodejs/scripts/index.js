$(document).ready(function() {
	// Debug mode
	var isDebug = true;

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

  // Parameters from the URL
  var usertype = $.getUrlVar("usertype");
  var userid = $.getUrlVar("userid");
  if (isDebug) console.log(usertype, userid);

  // Data
  var students = [];
  var tutors = [];
  var documents = [];
  var notifications = [];
  var appointments = [];

  // Start
  loadHomepage();
  if (isDebug) console.log(students, tutors, documents, notifications, appointments);

  function loadHomepage() {
  	// Remove all previously displayed content
  	clearAll();

  	// Reload data
  	loadAllData();

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

  	// Different views for different usertypes
  	if (usertype == "student") loadStudentView();
  	if (usertype == "tutor") loadTutorView();

  	function clearAll() {
  		$("#navbar").empty();
  		$("#leftCol").empty();
  		$("#centerCol").empty();
  		$("#rightCol").empty();
  	}

  	// Gather data. Not a good way to do in practice but convenient for this small assignment.
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
  }

	function loadStudentView() {
		modifyNavbar();
		loadHomeLeftCol();
		loadHomeCenterCol();
		loadHomeRightCol();

		$("#btnMakeAppointment").click(function() {chooseAppointmentOptions();});
		$("#btnAddDocument").click(addDocument);
		$(".btnRequestReview").each(function(index, obj) {
			$("#" + obj.id).click(function() {
				if (isDebug) console.log("Request a review on file id #" + obj.id.substring(16));
				chooseAppointmentOptions(obj.id.substring(16));	
			})
		});

		function chooseAppointmentOptions(fileId) {
			$("#centerCol").empty();
			
			var centerColHtml = "<div class='text-center'><h3>Make An Appointment</h3></div><div id='documentList'></div>";
			centerColHtml += "<form>";
			centerColHtml += "<div class='form-group row'><label for='fileToShare' class='col-sm-6 col-form-label'>Please select a file:</label>"
			centerColHtml += "<div class='col-sm-6'><select class='custom-select form-control' id='fileToShare'>";
			// Empty default value
			if (typeof(fileId) === 'undefined') { centerColHtml += "<option value='' disabled selected> -- Please select an option -- </option>"; }
			
			// Generate the list of files
			for (let i=0; i < documents.length; i++) {
				if (documents[i].studentid == userid) {
					if (documents[i].id == fileId) {
						centerColHtml += "<option value='" + documents[i].id + "' selected>" + documents[i].title + "</option>";
					} else {
						centerColHtml += "<option value='" + documents[i].id + "'>" + documents[i].title + "</option>";
					}
				}
			}

			centerColHtml += "</select></div></div>";
			centerColHtml += "<div class='form-group row'><label for='major' class='col-sm-6 col-form-label'>Please select a subject:</label>"
			centerColHtml += "<div class='col-sm-6'><select class='custom-select form-control' id='major'>";
			
			// Generate the list of majors
			var majorList = new Set();
			tutors.forEach(function(tut) {
				majorList.add(tut.major);
			});
			majorList = Array.from(majorList);
			majorList.sort();

			// Populate the select major dropdown
			centerColHtml += "<option value='' disabled selected> -- Please select an option -- </option>";
			for (let i = 0; i < majorList.length; i++) {
				centerColHtml += "<option value='" + (i+1) + "'>" + majorList[i] + "</option>";
			}

			centerColHtml += "</select></div></div>";
			centerColHtml += "<div class='form-group row'><label for='datepicker' class='col-sm-6'>Please select a timeslot:</label>";
			centerColHtml += "<div class='col-xs-6'><input type='text' class='form-control' id='datepicker'></div>";
			centerColHtml += "</div></form>";
			centerColHtml += "<script>$('#datepicker').datetimepicker({autoSize: false, controlType: 'select', oneLine: true, timeFormat: 'hh:mm tt', stepHour: 1, stepMinute: 30, hourMin: 8, hourMax: 17, minDate: 0 });$('#datepicker').datepicker('option', 'showAnim', 'slideDown' );</script>";

			centerColHtml += "<div class='text-center'><button class='btn backHome' style='margin:10px'>Cancel</button><button class='btn' id='btnViewAvailableTutors' style='margin:10px'>View available tutors</button></div><hr>"
			
			$("#centerCol").html(centerColHtml);

			$(".backHome").click(loadHomepage);
			$("#btnViewAvailableTutors").click(function() {
				if ($("#major").val() == null || $("#fileToShare").val() == null) {
					alert("One or more options are not selected");
				} else {
					var fileId = $("#fileToShare").val();
					var subject = $( "#major option:selected" ).text();
					var datetime = $("#datepicker").datetimepicker("getDate");

					if (isDebug) console.log(fileId, subject, datetime);
					
					viewAvailableTutors(fileId, subject, datetime);
				}				
			});
		}

		function addDocument() {
			$("#centerCol").empty();

			var centerColHtml = "<div class='text-center'><h3>Add a document</h3></div><div id='documentList'></div>";

			centerColHtml += "<p>Please upload a document to your Google Drive and share the link to the document.</p>";
			centerColHtml += "<form>";

			centerColHtml += "<div class='form-group row'><label class='col-sm-6 col-form-label'>Link to Google document:</label>"
			centerColHtml += "<div class='col-sm-6'>";
			centerColHtml += "<input type='text' class='form-control'>";
			centerColHtml += "</div></div>";

			centerColHtml += "<div class='form-group row'><label class='col-sm-6 col-form-label'>Title:</label>"
			centerColHtml += "<div class='col-sm-6'>";
			centerColHtml += "<input type='text' class='form-control'>";
			centerColHtml += "</div></div>";

			centerColHtml += "</div></form>";

			centerColHtml += "<div class='text-center'><input type='checkbox' class='form-check-input' id='checkboxRequestAfterSharing'><label class='form-check-label' for='checkboxRequestAfterSharing'>Also request a tutoring session</label></div>";

			centerColHtml += "<div class='text-center'><button class='btn backHome' style='margin:10px'>Cancel</button><button class='btn' id='btnShareDocument' style='margin:10px'>Share document</button></div><hr>";

			$("#centerCol").append(centerColHtml);

			$(".backHome").click(loadHomepage);

			$("#checkboxRequestAfterSharing").click(function() {
				if($(this).is(":checked")) {
					$("#btnShareDocument").html("Add document & Set up an appointment");
					$("#btnShareDocument").addClass("pink");
				} else {
					$("#btnShareDocument").html("Add document");
					$("#btnShareDocument").removeClass("pink");
				}
			});

			$("#btnShareDocument").click(function() {
				if($("#checkboxRequestAfterSharing").is(":checked")) {
						var fileId = saveDocumentToDatabase();
						chooseAppointmentOptions(fileId);
				} else {
						saveDocumentToDatabase();
						alert("Your new document has been added!");
						loadHomepage();
				}
			});
		}

		function saveDocumentToDatabase() {
			var fileId = Math.round(Math.random() * 10e6);
			return fileId;
		}

		function viewAvailableTutors(fileid, subject, datetime) {
			var availableTutors = [];

			tutors.forEach(function(tut) {
				if (tut.major == subject) availableTutors.push(tut); 
			})

			var avaTutHtml = "<tbody>";
			if (availableTutors.length > 0) {
				availableTutors.forEach(function(avatut) {
					avaTutHtml += "<tr>";
					avaTutHtml += "<td>" + avatut.fname + " " + avatut.lname + "</td>";
					avaTutHtml += "<td align='right'><button class='btn btnAppointmentViewProfile' id=''>View profile</button></td>";
					avaTutHtml += "<td align='right'><button class='btn btnAppointmentRequest' id='btnAppointmentRequest" + avatut.id + "'>Send appointment request</button></td>";
					avaTutHtml += "</tr>";
				})
			} else {
				avaTutHtml += "No tutor is available";
			}
			avaTutHtml += "</tbody>";	
			
			if ($("#availableTutorList").length) {} else { $("#centerCol").append("<div class='text-center'><h5>Tutors available during the selected timeslot</h5></div><table class='table' id='availableTutorList'></table>"); }

			$("#availableTutorList").html(avaTutHtml);

			$(".btnAppointmentRequest").each(function(index, obj) {
				var tutorid = obj.id.substring(21);
				if (isDebug) console.log(userid, fileid, tutorid);
				
				$("#" + obj.id).click(function() { sendAppointmentRequest(userid, fileid, tutorid, datetime) });
			});
		}

		function sendAppointmentRequest(studentId, fileId, tutorId, datetime) {
			$("#centerCol").empty();

			var centerColHtml = "<div class='text-center'><h3>Appointment Request Review</h3></div><div id='documentList'></div>";	

			centerColHtml += "<form>";
			centerColHtml += "<div class='form-group row'><label class='col-sm-6 col-form-label'>Selected document:</label>"
			centerColHtml += "<div class='col-sm-6'>";
			documents.forEach(function(doc) {
				if (doc.id == fileId) centerColHtml += "<a href='" + doc.url + "' target='_blank'>" + doc.title + "</a>";
			})
			centerColHtml += "</div></div>";

			centerColHtml += "<div class='form-group row'><label class='col-sm-6 col-form-label'>Tutor:</label>"
			centerColHtml += "<div class='col-sm-6'>";
			tutors.forEach(function(tut) {
				if (tut.id == tutorId) centerColHtml += tut.fname + " " + tut.lname;
			})
			centerColHtml += "</div></div>";

			centerColHtml += "<div class='form-group row'><label class='col-sm-6 col-form-label'>Time:</label>"
			centerColHtml += "<div class='col-sm-6'>";
			centerColHtml += datetime;
			centerColHtml += "</div></div>";

			centerColHtml += "</div></form>";
			centerColHtml += "<div class='text-center'><button class='btn' style='margin:10px' id='btnBackToMakeAppointment'>Cancel</button><button class='btn' id='btnSendAppointmentRequest' style='margin:10px'>Send Appointment Request</button></div><hr>";
				
			$("#centerCol").html(centerColHtml);	

			$("#btnBackToMakeAppointment").click(chooseAppointmentOptions);
			$("#btnSendAppointmentRequest").click(function() {
				alert("Request sent! Please wait for the tutor to respond. You are going to go back to your homepage.");
				loadHomepage();
			})
		}

		function loadHomeLeftCol() {
			var leftColHtml = "<div class='text-center'><h3>Schedule</h3></div>";
	  	leftColHtml += "<div class='text-center'>Upcoming appointments:</div>";
	  	leftColHtml += "<div id='appointmentList'></div>";
	  	$("#leftCol").html(leftColHtml);

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
	            
	            aptmntHtml += "Meet tutor <a href=''>";
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

	    $("#leftCol").append("<div class='text-center'><button id='btnMakeAppointment' class='btn' value='Make new appointment'>Make An Appointment</button></div>");
		}

		function loadHomeCenterCol() {
			// Center Panel
		  $("#centerCol").append("<div class='text-center'><h3>Your Documents</h3></div><div id='documentList'></div>");
		    
	    if (documents.length == 0) {
	      $("#documentList").append("<p>You have not shared any document yet</p>");
	      $("#documentList").append("<div class='text-center' style='margin-top: 20px'><input class='btn' type='button' value='Add a new document' /></div>");

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
	            $("#documentList").append("<td class='col-sm-3'><input class='btn btn-doc-action btnRequestReview' type='button' value='Request a review' id='btnRequestReview" + doc.id + "' /></td>");
	            $("#documentList").append("</tr>");
	          }
	        });
	        $("#documentList").append("</tbody></table>");
	        $("#documentList").append("<div class='text-center' style='margin-top: 20px'><input class='btn' type='button' id='btnAddDocument' value='Share a new document' onclick='' /></div>");
	      }
	    }
		}
		
		function loadHomeRightCol() {
			var rightColHtml = "<div class='text-center'><h3>Notifications</h3></div><div id='notificationList'></div>";
  		$("#rightCol").html(rightColHtml);

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
		}
	  
    function modifyNavbar() {
			// Navbar
	    $("#welcomeMsg").append("Welcome, student ");
	    students.forEach(function(stu) {
	      if (stu.id == userid)
	        $("#welcomeMsg").append(stu.fname + " " + stu.lname);
	    })
	    $("#welcomeMsg").append("</a><br />");
	    
	    $("#switchview").text("Switch to Tutor View");
	    
	    $("#navbarSupportedContent ul").append("<li class='nav-item active' style='vertical-align: middle; display: table-cell'><a class='nav-link' onclick='loadTutorSearchWindow()'>Tutor List <span class='sr-only'>(current)</span></a></li>");
		}
	}

	function loadTutorView(userid) {
    modifyNavbar();
    loadHomeLeftCol();
		loadHomeCenterCol();
		loadHomeRightCol();

		function modifyNavbar() {
	  	// Navbar
	    $("#welcomeMsg").append("Welcome, tutor ");
	    tutors.forEach(function(tut) {
	      if (tut.id == userid)
	        $("#welcomeMsg").append(tut.fname + " " + tut.lname);
	    })
	    $("#welcomeMsg").append("</a><br />");
	    $("#switchview").text("Switch to Student View");
	  }

		function loadHomeLeftCol() {
			var leftColHtml = "<div class='text-center'><h3>Schedule</h3></div>";
	  	leftColHtml += "<div class='text-center'>Upcoming appointments:</div>";
	  	leftColHtml += "<div id='appointmentList'></div>";
	  	$("#leftCol").html(leftColHtml);

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
		}
		
		function loadHomeCenterCol() {
	    $("#centerCol").append("<div class='text-center'><h3>Requests</h3></div><div id='requestList'></div>");
		}

		function loadHomeRightCol() {
			var rightColHtml = "<div class='text-center'><h3>Notifications</h3></div><div id='notificationList'></div>";
  		$("#rightCol").html(rightColHtml);

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
  }
});