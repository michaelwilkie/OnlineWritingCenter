const RapidAPI = require('rapidapi-connect');
const rapid = new RapidAPI("cs421", "c10b4173-cbf3-47c1-a35c-385dc88905c9");

rapid.call('GoogleDrive', 'getAccessToken', { 
	'clientSecret': 'zMU10xTzjcvYBtE-W8t2Jzja',
	'clientId': '217209785365-5jvpve71eiusjm071s3rhq315a11pddj.apps.googleusercontent.com'

}).on('success', (payload)=>{
	 /*YOUR CODE GOES HERE*/ 
}).on('error', (payload)=>{
	 /*YOUR CODE GOES HERE*/ 
});