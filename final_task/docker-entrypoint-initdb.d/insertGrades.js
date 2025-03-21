use university;
const student1 = db.Students.findOne({ surname: "Иванов" })._id;
const student2 = db.Students.findOne({ surname: "Петрова" })._id;
const student3 = db.Students.findOne({ surname: "Сидоров" })._id;
const student4 = db.Students.findOne({ surname: "Козлова" })._id;
const student5 = db.Students.findOne({ surname: "Новикова" })._id;
const student6 = db.Students.findOne({ surname: "Морозов" })._id;

const course1 = db.Courses.findOne({ course_name: "Базы данных" })._id;
const course2 = db.Courses.findOne({ course_name: "Математический анализ" })._id;
const course3 = db.Courses.findOne({ course_name: "Физика" })._id;
const course4 = db.Courses.findOne({ course_name: "Программирование на Python" })._id;
const course5 = db.Courses.findOne({ course_name: "Дискретная математика" })._id;
const course6 = db.Courses.findOne({ course_name: "Операционные системы" })._id;

db.Grades.insertMany([
    {
        student_id: student1,
        course_id: course1,
        grade: 8,
        date: new Date("2023-10-01")
    },
    {
        student_id: student2,
        course_id: course2,
        grade: 9,
        date: new Date("2023-10-02")
    },
    {
        student_id: student3,
        course_id: course1,
        grade: 7,
        date: new Date("2023-10-03")
    },
    {
        student_id: student4,
        course_id: course3,
        grade: 10,
        date: new Date("2023-10-04")
    },
    {
        student_id: student5,
        course_id: course4,
        grade: 8,
        date: new Date("2023-10-05")
    },
    {
        student_id: student6,
        course_id: course5,
        grade: 6,
        date: new Date("2023-10-06")
    },
    {
        student_id: student1,
        course_id: course6,
        grade: 9,
        date: new Date("2023-10-07")
    },
    {
        student_id: student2,
        course_id: course1,
        grade: 7,
        date: new Date("2023-10-08")
    },
    {
        student_id: student3,
        course_id: course2,
        grade: 8,
        date: new Date("2023-10-09")
    },
    {
        student_id: student4,
        course_id: course4,
        grade: 9,
        date: new Date("2023-10-10")
    }
]);
