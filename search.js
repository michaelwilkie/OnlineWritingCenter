var tutorlist = ["John Smith"		,
				 "John Smith Smith"	,
				 "John John Smith"	,
				 "John Smith Sr."	,
				 "John Smith Jr."	,
				 "John Smith III"	,
				 "John P. Smith"	,
				 "John Q. Smith"	];
var majorlist = ["Computer Science"	,
				 "Architecture"		,
				 "English"			,
				 "Business"			,
				 "Engineering"		];
var repeatnotfound = false;
var dict = [];
function initDictionary()
{
	for (var i = 0; i < tutorlist.length; i++)
	{
		dict.push({
			name: tutorlist[i],
			major: majorlist[Math.floor(Math.random() * 5)]
		});
	}
	var table = document.getElementById("tutortable");
	for (var i = 0; i < tutorlist.length; i++)
	{
		var entry = document.createElement('tr');
		var td = document.createElement('td');
		td.innerHTML = dict[i].name;
		var td2= document.createElement('td');
		td2.innerHTML = dict[i].major;
		entry.appendChild(td);
		entry.appendChild(td2);
		table.appendChild(entry);
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
}
function ClearSearch() 
{
	document.getElementById('clearbutton').style.display = 'none';
	$(searchresults).empty();
}