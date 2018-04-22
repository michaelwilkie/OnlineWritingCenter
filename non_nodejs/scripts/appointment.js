class Appointment {
  constructor(id, datetime, studentid, tutorid, fileid, description, status) {
    this.id = id;
    this.datetime = datetime;
    this.studentid = studentid;
    this.tutorid = tutorid;
    this.fileid = fileid;
    this.description = description;
    this.status = status;
  }
  toString()
  {
	  var finalString;
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
				finalString = aptmntHtml;
                // $("#appointmentList").append(aptmntHtml);
              }
            });
          }
        }
      });
	  return finalString;
  }
}

class AppointmentList
{
	this.appointments = [];
	constructor(filename)
	{
		$.getJSON(filename, function(data) 
		{
			data.Appointments.ForEach(function(s)
			{
				this.appointments.push(new Appointment(s.id, s.datetime, s.studentid, s.tutorid, s.fileid, s.description, s.status));
			});
		}
	}
	toString()
	{
		var finalString = "";
		this.appointments.ForEach(function(s)
		{
			finalString += s.toString();
		});
		return finalString;
	}
}