var time = 0;
var timexpire = 10;// * 60;
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
function startTimer()
{
	timerID = window.setInterval(updateTimer, 1000);
	document.getElementById("timexpire").innerHTML = "Expire: " + timexpire.toString().toHHMMSS();
}
function updateTimer()
{
	time++;
	document.getElementById("timestamp").innerHTML = "Time: " + time.toString().toHHMMSS();
	if (time >= timexpire)
	{
		window.clearInterval(timerID);
		alert("Tutoring session has expired! Click ok to continue to home page.");
		var index = document.location.href.lastIndexOf('/');
		document.location.href = document.location.href.substr(0, index + 1) + "index.html";
	}
}
function setSize()
{			
	document.getElementById("documentframe").style.width = "115%";
	document.getElementById("documentframe").style.height = "100%";
}