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
}

class NotificationList {
  constructor(notifications = []) {
    this.notifications = notifications;
  }

  load(filename) {
    var fs = require('fs');
    var obj = JSON.parse(fs.readFileSync(filename, 'utf8'));
    console.log(obj);
  }
}
