var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, '../', '/index.html'));
});

io.on('connection', function(socket) {
	console.log('a user connected');

	socket.on('notification', function(msg) {
		console.log('message: ' + msg);
		io.emit('notification', msg);
	});
	
	socket.on('disconnect', function() {
		console.log('user disconnected');
	});
});

http.listen(8080, function() {
	console.log('listening on port 8080');
});