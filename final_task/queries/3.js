const studentId = db.Students.findOne({ surname: "Иванов" })._id;
db.Grades.find({ student_id: studentId }).pretty();
