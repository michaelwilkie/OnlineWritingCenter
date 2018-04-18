var tutorlist = [];

var req = new XMLHttpRequest();
req.add

$.getJSON( "data/tutor.json", function( data ) 
{
	tutorlist = data.Tutors;
	console.log((tutorlist));
});
 
var repeatnotfound = false;
function initDictionary()
{
	var table = document.getElementById("tutortable");
	
	for (var i = 0; i < tutorlist.length; i++)
	{
		var entry = document.createElement('tr');
		var td = document.createElement('td');
		td.innerHTML = tutorlist[i].fname;
		var td2 = document.createElement('td');
		td2.innerHTML = tutorlist[i].lname;
		var td3 = document.createElement('td');
		td3.innerHTML = tutorlist[i].major;
		entry.appendChild(td);
		entry.appendChild(td2);
		entry.appendChild(td3);
		table.appendChild(entry);
		console.log(td);
		console.log(td2);
		console.log(td3);
	}
}
function Search() 
{
	var input, filter, table, tr, td, i;
	input 	= document.getElementById("searchbar");
	filter 	= input.value.toUpperCase();
	table 	= document.getElementById("tutortable");
	tr 		= table.getElementsByTagName("tr");
	for (i = 0; i < tr.length; i++)
	{
		td = tr[i].getElementsByTagName("td")[0];
		if (td)
			if (td.innerHTML.toUpperCase().indexOf(filter) > -1)
				tr[i].style.display = "";
			else
				tr[i].style.display = "none";
	}
	//alert(tutorlistQ);
}
function ClearSearch() 
{
	document.getElementById('clearbutton').style.display = 'none';
	$(searchresults).empty();
}