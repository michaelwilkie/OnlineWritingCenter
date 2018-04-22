class Student {
  constructor(id, fname, lname, major) {
    this.id = id;
    this.fname = fname;
    this.lname = lname;
    this.major = major;
  }
  toString()
  {
	  return "<a href='#'>" + fname + " " + lname + "</a>";
  }
}

class StudentList
{
	this.students = [];
	constructor(filename)
	{
		$.getJSON(filename, function(data) 
		{
			data.Students.ForEach(function(s)
			{
				this.students.push(new Student(s.id, s.fname, s.lname, s.major));
			});
		}
	}
	toString()
	{
		var finalString = "";
		this.students.ForEach(function(s)
		{
			finalString += s.toString();
		});
		return finalString;
	}
}