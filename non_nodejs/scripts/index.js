
$(document).ready(function() {
 var isLoggedIn = false;
 var usertype = "";
 var userid = 0;
 logInPage();

	function logInPage(){
		if (!isLoggedIn) {
			var studentLogin =[];
	 		var tutorLogin = [];

			$.ajax({
			  url: 'data/student.json',
			  async: false,
			  dataType: 'json',
			  success: function (data) { studentLogin = data.Students; }
			});

			$.ajax({
			  url: 'data/tutor.json',
			  async: false,
			  dataType: 'json',
			  success: function (data) { tutorLogin = data.Tutors; }
			});

			// log In Screen
	  	var logInHtml  ="<h2>Online Writing Center</h2><p></p> <p></p>";
			logInHtml +="<form name='login'> Username <input type='text' id='userid'/> <p></p>";
			logInHtml +="Password <input type='password' id='password'/> <p></p>";
			logInHtml +="<form action=''>Log in as: ";
			logInHtml +="<input type='radio' name='personType' value='student'> Student <input type='radio' name='personType' value='tutor'> Tutor<br>";
			logInHtml +="</form>";
	    logInHtml +="<button id = 'logInButton'>LOGIN</button> ";

	  	$("#centerCol").html(logInHtml);	

	  	$("#logInButton").click(function(){

	  		var x = $('input[name=personType]:checked').val();
	  		var username = $("#userid").val();
	  		var password = $("#password").val();

	  		if(x == "student" ) /*the following code checkes whether the entered userid and password are matching*/
	  		{
			 		studentLogin.forEach(function(studentL) {
						if (studentL.username == username && studentL.password == password) {
							usertype = x;
							userid = studentL.id;
							mainPageLoad(usertype, userid);
							isLoggedIn = true;
						}
					})

					if (!isLoggedIn) alert("Error Password or Username");
				}

				if(x == "tutor")
				{   
		 			tutorLogin.forEach(function(tutorL) {
						if (tutorL.username == username && tutorL.password == password) {
							usertype = x;
							userid = tutorL.id;
							mainPageLoad(usertype, userid);
							isLoggedIn = true;
						}
					})
					if (!isLoggedIn) alert("Error Password or Username");
				}
		 		else
				{
			  	alert("Error Password or Username")/*displays error message*/
			  }
		  })

		} else {
			mainPageLoad(usertype, userid);
		}
  }


function mainPageLoad(usertype, userid)
{
	// Debug mode
	var isDebug = true;

	// A short jQuery extension to read query parameters from the URL.
  // Referenced from the Candy Crush homework assignment.
  /*
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
  //var usertype = $.getUrlVar("usertype");
  //var userid = $.getUrlVar("userid");
  */
  
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
  	var navbarHtml = "<a class='navbar-brand' href='index.html' class='goHome'><h2>Online Writing Center</h2></a>";
  	navbarHtml += "<button class='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation'><span class='navbar-toggler-icon'></span></button>";
  	navbarHtml += "<div class='collapse navbar-collapse' id='navbarSupportedContent'>";
  	navbarHtml += "<ul class='navbar-nav mr-auto' style='display: table; margin-top: auto; margin-bottom: auto' id='pageList'>";
  	navbarHtml += "<li class='nav-item active' style='vertical-align: middle; display: table-cell'><a class='nav-link' href='index.html' class='goHome'>Home <span class='sr-only'>(current)</span></a></li>";
  	navbarHtml += "</ul>";
  	navbarHtml += "<div class='d-inline-block pull-right'><p class='text-right'><span id='welcomeMsg'></span><a href='#' id='switchview'>Switch to Tutor View</a> | <a href='#'' id='signout'>Sign out</a></p></div>";
  	navbarHtml += "</div>";
  	$("#navbar").html(navbarHtml);	

  	// Different views for different usertypes
  	if (usertype == "student") loadStudentView();
  	if (usertype == "tutor") loadTutorView();

  	$("#signout").click(function() {
  		isLoggedIn = false;
  		clearAll();
  		logInPage();
  	});

  	$(".goHome").click(function(){
  		clearAll();
  		loadHomepage();
  	})

  	function clearAll() {
  		$("#navbar").empty();
  		$("#leftCol").empty();
  		$("#centerCol").empty();
  		$("#rightCol").empty();
  	}

  	// Gather data. Not a good way to do in practice but convenient for this small assignment.
	  function loadAllData() {

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

			$(".btnAppointmentViewProfile").click(function(){
				console.log(hello);
			});

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

			// Document
			centerColHtml += "<form>";
			centerColHtml += "<div class='form-group row'><label class='col-sm-6 col-form-label'>Selected document:</label>"
			centerColHtml += "<div class='col-sm-6'>";
			documents.forEach(function(doc) {
				if (doc.id == fileId) centerColHtml += "<a href='" + doc.url + "' target='_blank'>" + doc.title + "</a>";
			})
			centerColHtml += "</div></div>";

			// Tutor
			centerColHtml += "<div class='form-group row'><label class='col-sm-6 col-form-label'>Tutor:</label>"
			centerColHtml += "<div class='col-sm-6'>";
			tutors.forEach(function(tut) {
				if (tut.id == tutorId) centerColHtml += tut.fname + " " + tut.lname;
			})
			centerColHtml += "</div></div>";

			// Time
			centerColHtml += "<div class='form-group row'><label class='col-sm-6 col-form-label'>Time:</label>"
			centerColHtml += "<div class='col-sm-6'>";
			centerColHtml += datetime;
			centerColHtml += "</div></div>";

			// Goals
			centerColHtml += "<div class='row'><label class='col-sm-12 col-form-label'>Goals of this session:</label></div>";
			centerColHtml += "<div class='row'><div class='col-sm-1'>#1</div><input type='text' class='col-sm-9' id='textareaGoal1' /><input type='button' class='btn btnClearGoal col-sm-2' id='btnClearGoal1' value='Clear' /></div>";
			centerColHtml += "<div class='row'><div class='col-sm-1'>#2</div><input type='text' class='col-sm-9' id='textareaGoal2' /><input type='button' class='btn btnClearGoal col-sm-2' id='btnClearGoal2' value='Clear' /></div>";
			centerColHtml += "<div class='row'><div class='col-sm-1'>#3</div><input type='text' class='col-sm-9' id='textareaGoal3' /><input type='button' class='btn btnClearGoal col-sm-2' id='btnClearGoal3' value='Clear' /></div>";
			centerColHtml += "<div class='row'><div class='col-sm-1'>#4</div><input type='text' class='col-sm-9' id='textareaGoal4' /><input type='button' class='btn btnClearGoal col-sm-2' id='btnClearGoal4' value='Clear' /></div>";
			centerColHtml += "<div class='row'><div class='col-sm-1'>#5</div><input type='text' class='col-sm-9' id='textareaGoal5' /><input type='button' class='btn btnClearGoal col-sm-2' id='btnClearGoal5' value='Clear' /></div>";

			centerColHtml += "</form>";
			centerColHtml += "<div class='text-center'><button class='btn' style='margin:10px' id='btnBackToMakeAppointment'>Cancel</button><button class='btn' id='btnSendAppointmentRequest' style='margin:10px'>Send Appointment Request</button></div><hr>";
				
			$("#centerCol").html(centerColHtml);	

			$(".btnClearGoal").each(function(index, obj) {
				$("#btnClearGoal" + obj.id.substring(12)).click(function() {
					if (isDebug) console.log("Cleared the textbox of goal#" + obj.id.substring(12));
					$("#textareaGoal" + obj.id.substring(12)).val("");
				})
			});
			$("#btnBackToMakeAppointment").click(chooseAppointmentOptions);
			$("#btnSendAppointmentRequest").click(function() 
			{
				saveAppointmentToDatabase();
				alert("Request sent! Please wait for the tutor to respond. You are going to go back to your homepage.");
				loadHomepage();
			})
		}

		function saveAppointmentToDatabase() {
			
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
	                aptmntHtml += "<span class='activateSession' id='activateSession" + aptmnt.id + "'>";
	                aptmntHtml += doc.title + "</span>";
	              }
	            });

	            aptmntHtml += "</p></div></div>";
	            $("#appointmentList").append(aptmntHtml);
	          }
	        });
	      }
	    }

	    $("#leftCol").append("<div class='text-center'><button id='btnMakeAppointment' class='btn' value='Make new appointment'>Make An Appointment</button></div>");

	    $(".activateSession").each(function(id, obj) {
        	$("#activateSession" + obj.id.substring(15)).click(function() {
        		activateSession(obj.id.substring(15));
        	})
        });
		}

		function activateSession(appointmentId) {
			// Prepare the columns
			$("#leftCol").empty();
			$("#rightCol").hide();
			$("#centerCol").removeClass("col-sm-6");
			$("#centerCol").addClass("col-sm-9");
			$("#centerCol").empty();

			var leftColHtml = "<div class='text-center'><h3>Goals</h3></div>";
			var centerColHtml = "";

			appointments.forEach(function(aptmnt) {
				if (aptmnt.id == appointmentId) {
					if (isDebug) console.log(aptmnt.id, appointmentId);

					// Goal 1
					if (aptmnt.goal1.length > 0) {
						leftColHtml += "<div class='sessionGoal' id='goal1'><input type='checkbox' id='checkboxGoal1' style='margin-left: 10px; display:inline-block'/>";
          	leftColHtml += "<label class='form-check-label' id='labelGoal1'> " + aptmnt.goal1 + "</label></div>";	
					}
					// Goal 2
					if (aptmnt.goal2.length > 0) {
						leftColHtml += "<div class='sessionGoal' id='goal2'><input type='checkbox' id='checkboxGoal2' style='margin-left: 10px; display:inline-block'/>";
          	leftColHtml += "<label class='form-check-label' id='labelGoal2'> " + aptmnt.goal2 + "</label></div>";	
					}
					// Goal 3
					if (aptmnt.goal3.length > 0) {
						leftColHtml += "<div class='sessionGoal' id='goal3'><input type='checkbox' id='checkboxGoal3' style='margin-left: 10px; display:inline-block'/>";
          	leftColHtml += "<label class='form-check-label' id='labelGoal3'> " + aptmnt.goal3 + "</label></div>";	
					}
					// Goal 4
					if (aptmnt.goal4.length > 0) {
						leftColHtml += "<div class='sessionGoal' id='goal4'><input type='checkbox' id='checkboxGoal4' style='margin-left: 10px; display:inline-block'/>";
          	leftColHtml += "<label class='form-check-label' id='labelGoal4'> " + aptmnt.goal4 + "</label></div>";	
					}
					// Goal 5
					if (aptmnt.goal5.length > 0) {
						leftColHtml += "<div class='sessionGoal' id='goal5'><input type='checkbox' id='checkboxGoal5' style='margin-left: 10px; display:inline-block'/>";
          	leftColHtml += "<label class='form-check-label' id='labelGoal5'> " + aptmnt.goal5 + "</label></div>";	
					}

					// Google Docs
					documents.forEach(function(doc) {
						if (doc.id == aptmnt.fileid) {
							if (isDebug) console.log(doc.url);
							centerColHtml += "<div class='row'><iframe class='resp-iframe' src='" + doc.url + "?embedded=true'><p>Your browser does not support iframes.</p></iframe></div>";
						}
					});
				}
			});

			// Timer
			leftColHtml += "<div class='text-center' style='margin-top:20px'><h3>Timer</h3></div><div id='timer'><span id='timestamp'>00:00:00</span> / <span id='timexpire'>00:00:00</span></div>";
			leftColHtml += "<div class='text-center' style='margin-top:20px'><button class='btn btnEndSession'>End Session</button></div>";
			leftColHtml += "<div id='dialog-confirm' title='End session?' style='visibility:hidden' id='sessionEndConfirmation'><p><span class='ui-icon ui-icon-alert' style='float:left; margin:12px 12px 20px 0;''></span >Are you sure you want to end this session?</p></div>";

			$("#leftCol").html(leftColHtml);
			$("#centerCol").html(centerColHtml);
			
			// Timer
			var time = 0;
			var timexpire = 15;
			var timerID;
			String.prototype.toHHMMSS = function () {
				var sec_num = parseInt(this, 10); // don't forget the second param
				var hours   = Math.floor(sec_num / 3600);
				var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
				var seconds = sec_num - (hours * 3600) - (minutes * 60);
				if (hours   < 10) {hours   = "0"+hours;}
				if (minutes < 10) {minutes = "0"+minutes;}
				if (seconds < 10) {seconds = "0"+seconds;}
				return hours+':'+minutes+':'+seconds;
			}

			var isBackHome = false;
			startTimer();
			
			$(".sessionGoal").each(function(index, goal) {
				var i = goal.id.substring(4);
				if (isDebug) console.log(i);
				$("#goal"+i).click(function() {
					$("#checkboxGoal"+i).attr("checked", !$("#checkboxGoal"+i).attr("checked"));
					$("#labelGoal"+i).toggleClass("strikethroughtext");
				})
			})

			$(".btnEndSession").click(function() {
				$("#sessionEndConfirmation").css("visibility", "visible");
				$( "#dialog-confirm" ).dialog({
		      resizable: false,
		      height: "auto",
		      width: 400,
		      modal: true,
		      buttons: {
		        "Yes": function() {
		          $( this ).dialog( "close" );
		          isBackHome = true;
		          $("#rightCol").show();
							$("#centerCol").addClass("col-sm-6");
							$("#centerCol").removeClass("col-sm-9");
		          loadHomepage();
		        },
		        No: function() {
		          $( this ).dialog( "close" );
		        }
		      }
		    });
				//loadHomepage();
			})
					
			function startTimer()
			{
				timerID = window.setInterval(updateTimer, 1000);
				$("#timexpire").html("Expire: " + timexpire.toString().toHHMMSS());
			}
			function updateTimer()
			{
				if (!isBackHome) time++;
				$("#timestamp").html("Time: " + time.toString().toHHMMSS());
				if (time >= timexpire)
				{
					window.clearInterval(timerID);
					alert("Tutoring session has expired! Click ok to continue to home page.");
					isBackHome = true;
		      $("#rightCol").show();
					$("#centerCol").addClass("col-sm-6");
					$("#centerCol").removeClass("col-sm-9");
					loadHomepage();
				}
			}
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
	        $("#documentList").append("<div class='text-center' style='margin-top: 20px'><input class='btn' type='button' id='btnAddDocument' value='Share a new document' onclick='' /></div>");

	      
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
	    
	    $("#navbarSupportedContent ul").append("<li class='nav-item active' style='vertical-align: middle; display: table-cell'><a class='nav-link' href='index.html'>Tutor List <span class='sr-only'>(current)</span></a></li>");
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

		function activateSession(appointmentId) {
			// Prepare the columns
			$("#leftCol").empty();
			$("#rightCol").hide();
			$("#centerCol").removeClass("col-sm-6");
			$("#centerCol").addClass("col-sm-9");
			$("#centerCol").empty();

			var leftColHtml = "<div class='text-center'><h3>Goals</h3></div>";
			var centerColHtml = "";

			appointments.forEach(function(aptmnt) {
				if (aptmnt.id == appointmentId) {
					if (isDebug) console.log(aptmnt.id, appointmentId);

					// Goal 1
					if (aptmnt.goal1.length > 0) {
						leftColHtml += "<div class='sessionGoal' id='goal1'><input type='checkbox' id='checkboxGoal1' style='margin-left: 10px; display:inline-block'/>";
          	leftColHtml += "<label class='form-check-label' id='labelGoal1'> " + aptmnt.goal1 + "</label></div>";	
					}
					// Goal 2
					if (aptmnt.goal2.length > 0) {
						leftColHtml += "<div class='sessionGoal' id='goal2'><input type='checkbox' id='checkboxGoal2' style='margin-left: 10px; display:inline-block'/>";
          	leftColHtml += "<label class='form-check-label' id='labelGoal2'> " + aptmnt.goal2 + "</label></div>";	
					}
					// Goal 3
					if (aptmnt.goal3.length > 0) {
						leftColHtml += "<div class='sessionGoal' id='goal3'><input type='checkbox' id='checkboxGoal3' style='margin-left: 10px; display:inline-block'/>";
          	leftColHtml += "<label class='form-check-label' id='labelGoal3'> " + aptmnt.goal3 + "</label></div>";	
					}
					// Goal 4
					if (aptmnt.goal4.length > 0) {
						leftColHtml += "<div class='sessionGoal' id='goal4'><input type='checkbox' id='checkboxGoal4' style='margin-left: 10px; display:inline-block'/>";
          	leftColHtml += "<label class='form-check-label' id='labelGoal4'> " + aptmnt.goal4 + "</label></div>";	
					}
					// Goal 5
					if (aptmnt.goal5.length > 0) {
						leftColHtml += "<div class='sessionGoal' id='goal5'><input type='checkbox' id='checkboxGoal5' style='margin-left: 10px; display:inline-block'/>";
          	leftColHtml += "<label class='form-check-label' id='labelGoal5'> " + aptmnt.goal5 + "</label></div>";	
					}

					// Google Docs
					documents.forEach(function(doc) {
						if (doc.id == aptmnt.fileid) {
							if (isDebug) console.log(doc.url);
							centerColHtml += "<div class='row'><iframe class='resp-iframe' src='" + doc.url + "?embedded=true'><p>Your browser does not support iframes.</p></iframe></div>";
						}
					});
				}
			});

			// Timer
			leftColHtml += "<div class='text-center' style='margin-top:20px'><h3>Timer</h3></div><div id='timer'><span id='timestamp'>00:00:00</span> / <span id='timexpire'>00:00:00</span></div>";
			leftColHtml += "<div class='text-center' style='margin-top:20px'><button class='btn btnEndSession'>End Session</button></div>";
			leftColHtml += "<div id='dialog-confirm' title='End session?' style='visibility:hidden' id='sessionEndConfirmation'><p><span class='ui-icon ui-icon-alert' style='float:left; margin:12px 12px 20px 0;''></span >Are you sure you want to end this session?</p></div>";

			$("#leftCol").html(leftColHtml);
			$("#centerCol").html(centerColHtml);
			
			// Timer
			var time = 0;
			var timexpire = 15;
			var timerID;
			String.prototype.toHHMMSS = function () {
				var sec_num = parseInt(this, 10); // don't forget the second param
				var hours   = Math.floor(sec_num / 3600);
				var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
				var seconds = sec_num - (hours * 3600) - (minutes * 60);
				if (hours   < 10) {hours   = "0"+hours;}
				if (minutes < 10) {minutes = "0"+minutes;}
				if (seconds < 10) {seconds = "0"+seconds;}
				return hours+':'+minutes+':'+seconds;
			}

			var isBackHome = false;
			startTimer();
			
			$(".sessionGoal").each(function(index, goal) {
				var i = goal.id.substring(4);
				if (isDebug) console.log(i);
				$("#goal"+i).click(function() {
					$("#checkboxGoal"+i).attr("checked", !$("#checkboxGoal"+i).attr("checked"));
					$("#labelGoal"+i).toggleClass("strikethroughtext");
				})
			})

			$(".btnEndSession").click(function() {
				$("#sessionEndConfirmation").css("visibility", "visible");
				$( "#dialog-confirm" ).dialog({
		      resizable: false,
		      height: "auto",
		      width: 400,
		      modal: true,
		      buttons: {
		        "Yes": function() {
		          $( this ).dialog( "close" );
		          isBackHome = true;
		          $("#rightCol").show();
							$("#centerCol").addClass("col-sm-6");
							$("#centerCol").removeClass("col-sm-9");
		          loadHomepage();
		        },
		        No: function() {
		          $( this ).dialog( "close" );
		        }
		      }
		    });
				//loadHomepage();
			})
					
			function startTimer()
			{
				timerID = window.setInterval(updateTimer, 1000);
				$("#timexpire").html("Expire: " + timexpire.toString().toHHMMSS());
			}
			function updateTimer()
			{
				if (!isBackHome) time++;
				$("#timestamp").html("Time: " + time.toString().toHHMMSS());
				if (time >= timexpire)
				{
					window.clearInterval(timerID);
					alert("Tutoring session has expired! Click ok to continue to home page.");
					isBackHome = true;
		      $("#rightCol").show();
					$("#centerCol").addClass("col-sm-6");
					$("#centerCol").removeClass("col-sm-9");
					loadHomepage();
				}
			}
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
			$("#centerCol").append("<div class='text-center'><h3>Active Reviews</h3></div><div id='reviewingList'></div>");
			if (documents.length == 0) {
	      $("#reviewingList").append("<p>You have no shared documents yet</p>");
	      //$("#reviewingList").append("<div class='text-center' style='margin-top: 20px'><input class='btn' type='button' value='Add a new document' /></div>");
			}
			else {
				var ownDocs = false;
	      documents.forEach(function(doc) {
	        ownDocs = ownDocs || (doc.tutorid == userid);
	      });

	      if (!ownDocs) {
					//console.log("!owned doc");

	        $("#reviewingList").append("<p class='text-center'>You have no active documents to review</p>");
	        //$("#documentList").append("<div class='text-center' style='margin-top: 20px'><input class='btn' type='button' id='btnAddDocument' value='Share a new document' onclick='' /></div>");

	      
	      } else {
					// console.log("owned doc");
					//console.log(doc);

					$("#reviewingList").append("<table class='table'><tbody>");
			
	        documents.forEach(function(doc) {
						console.log(doc);

	          //if (doc.studentid == 1) {
	            $("#reviewingList").append("<tr class='row col-sm-12'>");
	            $("#reviewingList").append("<td class='col-sm-6'>" + doc.title + "</td>");
	            $("#reviewingList").append("<td class='col-sm-3'><input class='btn btn-doc-action' type='button' value='Open in a new tab' onclick='window.open(\x22" + doc.url + "\x22)' /></td>");
	            $("#reviewingList").append("<td class='col-sm-3'><input class='btn btnReviewDocument' type='button' value='Review Document' id='btnReviewDocument" + doc.id + "' /></td>");
	            $("#reviewingList").append("</tr>");
	          //}
	        });
	        $("#reviewingList").append("</tbody></table>");
	        //$("#documentList").append("<div class='text-center' style='margin-top: 20px'><input class='btn' type='button' id='btnAddDocument' value='Share a new document' onclick='' /></div>");
	      }
			}
			
			$(".btnReviewDocument").click(reviewDocument);
		}

		function reviewDocument(){
			$("#centerCol").removeClass("col-sm-6");
			$("#centerCol").addClass("col-sm-9");
			$("#centerCol").empty();
			$("#leftCol").empty();
			$("#rightCol").hide();

			var leftColHtml= "<div ><button class='btn' id='btnBack'> < Back</button></div>";
			//leftColHtml = "<div class='text-center'><h3>Goals</h3></div>";
			leftColHtml += "<div class='text-center'><h3>Tasks</h3></div>";

			appointments.forEach(function(aptmnt) {
					// Goal 1
					if (aptmnt.goal1.length > 0) {
						leftColHtml += "<div class='sessionGoal' id='goal1'><input type='checkbox' id='checkboxGoal1' style='margin-left: 10px; display:inline-block'/>";
          	leftColHtml += "<label class='form-check-label' id='labelGoal1'> " + aptmnt.goal1 + "</label></div>";	
					}
					// Goal 2
					if (aptmnt.goal2.length > 0) {
						leftColHtml += "<div class='sessionGoal' id='goal2'><input type='checkbox' id='checkboxGoal2' style='margin-left: 10px; display:inline-block'/>";
          	leftColHtml += "<label class='form-check-label' id='labelGoal2'> " + aptmnt.goal2 + "</label></div>";	
					}
					// Goal 3
					if (aptmnt.goal3.length > 0) {
						leftColHtml += "<div class='sessionGoal' id='goal3'><input type='checkbox' id='checkboxGoal3' style='margin-left: 10px; display:inline-block'/>";
          	leftColHtml += "<label class='form-check-label' id='labelGoal3'> " + aptmnt.goal3 + "</label></div>";	
					}
					// Goal 4
					if (aptmnt.goal4.length > 0) {
						leftColHtml += "<div class='sessionGoal' id='goal4'><input type='checkbox' id='checkboxGoal4' style='margin-left: 10px; display:inline-block'/>";
          	leftColHtml += "<label class='form-check-label' id='labelGoal4'> " + aptmnt.goal4 + "</label></div>";	
					}
					// Goal 5
					if (aptmnt.goal5.length > 0) {
						leftColHtml += "<div class='sessionGoal' id='goal5'><input type='checkbox' id='checkboxGoal5' style='margin-left: 10px; display:inline-block'/>";
          	leftColHtml += "<label class='form-check-label' id='labelGoal5'> " + aptmnt.goal5 + "</label></div>";	
					}
				});

			$("#leftCol").html(leftColHtml);
			$("#centerCol").append("<div class='text-center'><h3>Loading...</h3></div>");
			$("#centerCol").append("<div class='row'><iframe class='resp-iframe' src='https://docs.google.com/document/d/1NcX4Ni8MEZkaHtvkImCiUdBV0UQM1PSIzguogRw5_Uw/edit'></iframe></div>" );
			
			$("#btnBack").click(function(){
				$("#centerCol").removeClass("col-sm-9");
				$("#centerCol").addClass("col-sm-6");
				$("#centerCol").empty();
				$("#leftCol").empty();
				$("#rightCol").show();
				loadHomeCenterCol();
				loadHomeLeftCol();
			});
		}

		function loadHomeRightCol() {
			var rightColHtml = "<div class='text-center'><h3>Notifications</h3></div><div id='notificationList'></div>";
  		$("#rightCol").html(rightColHtml);
			
			var notiHtml = "<div class='text-center' id='noNoti'><p>No New Notifications</p></div><div></div>";
			notiHtml += "</p></div></div>";
			$("#notificationList").append(notiHtml);
			
			notifications.forEach(function(noti) {
	      if (noti.receivertype == usertype && noti.receiverid == userid) {
					$("#noNoti").empty();
	        notiHtml = "<div class='card' style='padding: 5px; margin: 10px'>";
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
}
});