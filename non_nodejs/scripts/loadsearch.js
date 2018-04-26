
function loadTutorSearchWindow()
{
	$("#centerCol").empty();
		//$("#centerCol").append("<div class='col-xs-6 middle'>");
			$("#centerCol").append("<div class='text-center' style='background-color:darkcyan; color:white;'>");
				$("#centerCol").append("<h3>Avaliable Tutors</h3>");
            $("#centerCol").append("</div>");

            $("#centerCol").append("<div style='padding-left: 15px;'>");
                
				$("#centerCol").append("<input id='searchbar' type='text' placeholder='Search' style='background-color:light-gray;padding: 5px;'/>");
                
            $("#centerCol").append('</div>');
			
			$("#centerCol").append("<div class='d-inline-block pull-right'>");
				$("#centerCol").append("<input id='searchbar2' type='text' placeholder='by Major' style='background-color:light-gray;padding: 5px;'/>");
			$("#centerCol").append("</div>");
			

			$("#centerCol").append("<div class='tutor' id='tutors'>");
				//<!-- to be filled by search.js -->
			$("#centerCol").append("</div>");
            
            
		//$("#centerCol").append("</div>");
		drawTables();
}