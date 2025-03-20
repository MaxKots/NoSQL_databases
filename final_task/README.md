# Учёт оценок студентов университета в MongoDB

Этот проект представляет собой базу данных для учёта оценок студентов университета, реализованную на MongoDB. В проекте используются Docker для поднятия MongoDB, а также JavaScript-скрипты для заполнения базы данных тестовыми данными.

---

## Содержание
1. [Запуск MongoDB с помощью Docker](#запуск-mongodb-с-помощью-docker)
2. [Структура базы данных](#структура-базы-данных)
3. [Заполнение базы данных](#заполнение-базы-данных)
4. [Примеры запросов](#примеры-запросов)
5. [Как использовать](#как-использовать) Еще не дописано

---

## Запуск MongoDB с помощью Docker

Для поднятия MongoDB используется Docker Compose. Ниже приведён файл `docker-compose.yml`:

```version: '3.8'

services:
  mongodb:
    image: mongo:latest
    container_name: mongodb
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: admin
    volumes:
      - mongodb_data:/data/db
      - ~/NoSQL_databases/datagen:/scripts

volumes:
  mongodb_data:
```

это монтирует директорию /home/max/NoSQL_databases с вашего хоста в директорию /scripts внутри контейнера:
```
~/NoSQL_databases/datagen:/scripts
```

Нужно скопировать к себе репозиторий и открыть директорию с docker-compose файлом: 
```
NoSQL_databases/final_task/
```

выполнить команду: 
```
docker-compose up -d
```

Подключаемся:
```
docker exec -it mongodb mongosh "mongodb://admin:admin@localhost:27017"
```

Надо убедиться, что коллекицй нет с помощью команды:
```
show collections;
```

Создание коллекций:
```
use university;
db.createCollection("Students");
db.createCollection("Teachers");
db.createCollection("Courses");
db.createCollection("Grades");
db.createCollection("Groups");
```

### индексы:
Индекс на student_id в коллекции Grades для ускорения поиска оценок студента.
```
db.Grades.createIndex({ student_id: 1 });
```

Индекс на course_id в коллекции Grades для ускорения поиска оценок по курсу.
```
db.Grades.createIndex({ course_id: 1 });
```

Индекс на group в коллекции Students для ускорения поиска студентов по группе.
```
db.Students.createIndex({ group: 1 });
```

## структура-базы-данных
```plaintext
Students ────< Grades >─── Courses
                │
                └─── Teachers
```

Все запросы не забыть положить в:

    insertStudents.js

    insertTeachers.js

    insertCourses.js

    insertGroups.js

    insertGrades.js

## заполнение-базы-данных
Заполнить бд простенькими данными:

1. Заполнение коллекции Students

db.Students.insertMany([
    {
        name: "Иван",
        surname: "Иванов",
        group: "Группа 101",
        faculty: "Факультет информатики",
        year_of_admission: 2023
    },
    {
        name: "Мария",
        surname: "Петрова",
        group: "Группа 102",
        faculty: "Факультет математики",
        year_of_admission: 2023
    },
    {
        name: "Алексей",
        surname: "Сидоров",
        group: "Группа 101",
        faculty: "Факультет информатики",
        year_of_admission: 2023
    },
    {
        name: "Елена",
        surname: "Козлова",
        group: "Группа 103",
        faculty: "Факультет физики",
        year_of_admission: 2023
    },
    {
        name: "Ольга",
        surname: "Новикова",
        group: "Группа 102",
        faculty: "Факультет математики",
        year_of_admission: 2023
    },
    {
        name: "Павел",
        surname: "Морозов",
        group: "Группа 101",
        faculty: "Факультет информатики",
        year_of_admission: 2023
    }
]);


2. Заполнение коллекции Teachers

db.Teachers.insertMany([
    {
        name: "Дмитрий",
        surname: "Калугин-Балашов",
        department: "Кафедра информатики",
        academic_degree: "Доцент"
    },
    {
        name: "Ольга",
        surname: "Смирнова",
        department: "Кафедра математики",
        academic_degree: "Профессор"
    },
    {
        name: "Андрей",
        surname: "Васильев",
        department: "Кафедра физики",
        academic_degree: "Доцент"
    },
    {
        name: "Екатерина",
        surname: "Иванова",
        department: "Кафедра информатики",
        academic_degree: "Старший преподаватель"
    }
]);


3. Заполнение коллекции Courses

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


4. Заполнение коллекции Grades

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



Примеры запросов:

1.Получить всех студентов:
db.Students.find().pretty();

2.Получить все курсы, которые ведёт определённый преподаватель:
const teacherId = db.Teachers.findOne({ surname: "Калугин-Балашов" })._id;
db.Courses.find({ teacher_id: teacherId }).pretty();

3.Получить все оценки студента:
const studentId = db.Students.findOne({ surname: "Иванов" })._id;
db.Grades.find({ student_id: studentId }).pretty();

4. Найти средний балл каждого студента
db.Grades.aggregate([
  {
    $group: {
      _id: "$student_id",
      averageGrade: { $avg: "$grade" }
    }
  },
  {
    $lookup: {
      from: "Students",
      localField: "_id",
      foreignField: "_id",
      as: "student"
    }
  },
  {
    $unwind: "$student"
  },
  {
    $project: {
      "student.name": 1,
      "student.surname": 1,
      averageGrade: 1,
      _id: 0
    }
  }
]);


2. Найти студентов, у которых есть хотя бы одна оценка выше 8
db.Grades.aggregate([
  {
    $match: { grade: { $gt: 8 } }
  },
  {
    $lookup: {
      from: "Students",
      localField: "student_id",
      foreignField: "_id",
      as: "student"
    }
  },
  {
    $unwind: "$student"
  },
  {
    $group: {
      _id: "$student_id",
      name: { $first: "$student.name" },
      surname: { $first: "$student.surname" }
    }
  }
]);

3. Найти количество студентов на каждом факультете
db.Students.aggregate([
  {
    $group: {
      _id: "$faculty",
      totalStudents: { $sum: 1 }
    }
  }
]);

4. Найти курсы, которые ведёт определённый преподаватель

db.Teachers.aggregate([
  {
    $match: { surname: "Калугин-Балашов" }
  },
  {
    $lookup: {
      from: "Courses",
      localField: "_id",
      foreignField: "teacher_id",
      as: "courses"
    }
  },
  {
    $unwind: "$courses"
  },
  {
    $project: {
      "courses.course_name": 1,
      _id: 0
    }
  }
]);



5. Найти студентов, которые учатся на факультете "Факультет информатики" и имеют оценки выше 9
db.Grades.aggregate([
  {
    $match: { grade: { $gt: 9 } }
  },
  {
    $lookup: {
      from: "Students",
      localField: "student_id",
      foreignField: "_id",
      as: "student"
    }
  },
  {
    $unwind: "$student"
  },
  {
    $match: { "student.faculty": "Факультет информатики" }
  },
  {
    $group: {
      _id: "$student_id",
      name: { $first: "$student.name" },
      surname: { $first: "$student.surname" }
    }
  }
]);

6. Найти средний балл по каждому курсу
db.Grades.aggregate([
  {
    $group: {
      _id: "$course_id",
      averageGrade: { $avg: "$grade" }
    }
  },
  {
    $lookup: {
      from: "Courses",
      localField: "_id",
      foreignField: "_id",
      as: "course"
    }
  },
  {
    $unwind: "$course"
  },
  {
    $project: {
      "course.course_name": 1,
      averageGrade: 1,
      _id: 0
    }
  }
]);

7. Найти студентов, которые не получили ни одной оценки
db.Students.aggregate([
  {
    $lookup: {
      from: "Grades",
      localField: "_id",
      foreignField: "student_id",
      as: "grades"
    }
  },
  {
    $match: { grades: { $size: 0 } }
  },
  {
    $project: {
      name: 1,
      surname: 1,
      _id: 0
    }
  }
]);

8. Найти преподавателя с наибольшим количеством курсов
db.Courses.aggregate([
  {
    $group: {
      _id: "$teacher_id",
      totalCourses: { $sum: 1 }
    }
  },
  {
    $sort: { totalCourses: -1 }
  },
  {
    $limit: 1
  },
  {
    $lookup: {
      from: "Teachers",
      localField: "_id",
      foreignField: "_id",
      as: "teacher"
    }
  },
  {
    $unwind: "$teacher"
  },
  {
    $project: {
      "teacher.name": 1,
      "teacher.surname": 1,
      totalCourses: 1,
      _id: 0
    }
  }
]);


9. Найти студентов, которые сдали все курсы на отлично (оценка 10)
db.Grades.aggregate([
  {
    $group: {
      _id: "$student_id",
      minGrade: { $min: "$grade" }
    }
  },
  {
    $match: { minGrade: 10 }
  },
  {
    $lookup: {
      from: "Students",
      localField: "_id",
      foreignField: "_id",
      as: "student"
    }
  },
  {
    $unwind: "$student"
  },
  {
    $project: {
      "student.name": 1,
      "student.surname": 1,
      _id: 0
    }
  }
]);


На всякий случай приложу гайд, как подключиться через dbeaver:

1.Подключаемся через Dbeaver, используя строку подключения:
mongodb://admin:admin@localhost:27017:
DBeaver Community Edition не поддерживает MongoDB "из коробки", но вы можете установить драйвер вручную.

    Откройте DBeaver.

    Перейдите в меню Database → Driver Manager.

    Нажмите кнопку New для создания нового драйвера.

    Заполните поля:

        Driver Name: MongoDB

        Class Name: com.mongodb.client.MongoClient

        URL Template: mongodb://{host}:{port}

        Default Port: 27017

    На вкладке Libraries нажмите Add File и добавьте файл JAR-драйвера MongoDB(находится в корневой папке проекта)

    Нажмите OK, чтобы сохранить драйвер.


2. Создайте подключение к MongoDB

    В DBeaver нажмите Database → New Database Connection.

    Выберите MongoDB из списка баз данных.

    Заполните параметры подключения:

        Host: localhost (или IP-адрес сервера MongoDB).

        Port: 27017 (стандартный порт MongoDB).

        Database: Название вашей базы данных (например, university).

        Authentication:

            Если используется аутентификация, укажите Username и Password (например, admin/admin, если вы использовали настройки из docker-compose.yml).

    Нажмите Test Connection, чтобы проверить подключение.

    Если подключение успешно, нажмите Finish.


