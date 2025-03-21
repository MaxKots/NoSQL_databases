const teacherId = db.Teachers.findOne({ surname: "Калугин-Балашов" })._id;
db.Courses.find({ teacher_id: teacherId }).pretty();
