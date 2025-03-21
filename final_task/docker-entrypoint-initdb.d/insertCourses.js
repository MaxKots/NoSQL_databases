use university;
const teacher1 = db.Teachers.findOne({ surname: "Калугин-Балашов" })._id;
const teacher2 = db.Teachers.findOne({ surname: "Смирнова" })._id;
const teacher3 = db.Teachers.findOne({ surname: "Васильев" })._id;
const teacher4 = db.Teachers.findOne({ surname: "Иванова" })._id;

db.Courses.insertMany([
    {
        course_name: "Базы данных",
        teacher_id: teacher1,
        credits: 5
    },
    {
        course_name: "Математический анализ",
        teacher_id: teacher2,
        credits: 6
    },
    {
        course_name: "Физика",
        teacher_id: teacher3,
        credits: 4
    },
    {
        course_name: "Программирование на Python",
        teacher_id: teacher4,
        credits: 5
    },
    {
        course_name: "Дискретная математика",
        teacher_id: teacher2,
        credits: 4
    },
    {
        course_name: "Операционные системы",
        teacher_id: teacher1,
        credits: 5
    }
]);
