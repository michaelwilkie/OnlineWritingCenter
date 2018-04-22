class Notification {
  constructor(id, type, timestamp, sendertype, senderid, receivertype, receiverid, message) {
    this.id = id;
    this.type = type;
    this.timestamp = timestamp;
    this.sendertype = sendertype;
    this.senderid = senderid;
    this.receivertype = receivertype;
    this.receiverid = receiverid;
    this.message = message;
  }
  toString()
  {
	  var finalString;
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
            finalString = notiHtml;
			//$("#notificationList").append(notiHtml);
          }
        });
      });
	  return finalString;
  }
}

class NotificationList 
{
	this.notifications = [];
	constructor(filename)
	{
		$.getJSON(filename, function(data) 
		{
			data.Notifications.ForEach(function(s)
			{
				this.notifications.push(new Notification(s.id, s.type, s.timestamp, s.sendertype, s.senderid, s.receivertype, s.receiverid, s.message));
			});
		}
	}

	load(filename) 
	{
		var fs = require('fs');
		var obj = JSON.parse(fs.readFileSync(filename, 'utf8'));
		console.log(obj);
	}
	toString()
	{
		var finalString = "";
		this.notifications.ForEach(function(s)
		{
			finalString += s.toString();
		});
		return finalString;
	}
}
