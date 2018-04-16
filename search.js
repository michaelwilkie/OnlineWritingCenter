var tutorlist = [];
var displaylist = [];
$.getJSON( "data/tutor.json", function( data ) 
{
	tutorlist = data.Tutors;
	displaylist = tutorlist;
	console.log((tutorlist));
});
 
var repeatnotfound = false;
function drawTables()
{
	var divlist = document.getElementById("tutors");
	for (var i = 0; i < displaylist.length; i++)
	{
		var table = document.createElement('table');
		table.style.borderTop = "solid #CCCCCC";
		
		var row = document.createElement('tr');
		row.style.padding = "15px";
		
		var entry = document.createElement('th');
		entry.style.padding = "15px";
		entry.id = "img";
		
		var img = document.createElement('img');
		img.className = "profileImg";
		img.src = "anon.png";
		
		var entry2 = document.createElement('th');
		entry2.style.padding = "15px";
		entry2.style.width = "50%";
		entry2.id = "name";
		entry2.innerHTML = displaylist[i].fname + " " + displaylist[i].lname + "<br>" +
						displaylist[i].major;
		
		var entry3 = document.createElement('th');
		entry3.style.padding = "15px";
		entry3.style.cssFloat = "left";
		entry3.id = "buttons";
		
		var button = document.createElement('button');
		button.className = "btn";
		button.style.backgroundColor = "pink";
		button.innerHTML = "View Profile";
		
		var button2 = document.createElement('button');
		button2.className = "btn";
		button2.style.backgroundColor = "lightgreen";
		button2.innerHTML = "Set Appointment";
		
		// table
		//	- row
		//		- entry  -id = img
		//			- img
		//		- entry2 -id = name
		//		- entry3 -id = buttons
		//			- button
		//			- button2

		entry3.appendChild(button);
		entry3.appendChild(button2);
		entry.appendChild(img);
		row.appendChild(entry);
		row.appendChild(entry2);
		row.appendChild(entry3);
		table.appendChild(row);
		divlist.appendChild(table);
	}
}

// table
//	- row
//		- entry -id = img
//			- img
//		- entry2 -id = name
//		- entry3 -id = buttons
//			- button
//			- button2
function Search() 
{
	displaylist = [];
	ClearSearch();
	var input, filter;
	input 	= document.getElementById("searchbar");
	filter 	= input.value.toUpperCase();
	for(var i = 0; i < tutorlist.length; i++)
	{
		if ((tutorlist[i].fname + " " + tutorlist[i].lname).toUpperCase().indexOf(filter) > -1)
			displaylist.push(tutorlist[i]);
	}
	
	drawTables();
}
function ClearSearch() 
{
	$(tutors).empty();
}