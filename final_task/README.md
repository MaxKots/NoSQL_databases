# Учёт оценок студентов университета в MongoDB

Этот проект представляет собой базу данных для учёта оценок студентов университета, реализованную на MongoDB. В проекте используются Docker для поднятия MongoDB, а также JavaScript-скрипты для заполнения базы данных тестовыми данными.

---

## Google-документ с описанием и скришнотами по [ссылке](https://docs.google.com/document/d/1EXbAObt53tXJGGJxyKNN0-Hfd-cvbQRkotvGVbGSoMU/edit?tab=t.0)
## Содержание
1. [Запуск MongoDB с помощью Docker](#запуск-mongodb-с-помощью-docker)
2. [Структура базы данных](#структура-базы-данных)
3. [Заполнение базы данных](#заполнение-базы-данных)
4. [Примеры запросов](#примеры-запросов) 

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
      - ./docker-entrypoint-initdb.d:/docker-entrypoint-initdb.d
      - ./queries:/scripts

volumes:
  mongodb_data:
```

эта команда монтирует директорию /home/max/NoSQL_databases с хоста в директорию /scripts внутри контейнера:
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

## заполнение-базы-данных
При запуске контейнера будут запущены заполняющие скрипты:
```
    insertStudents.js

    insertTeachers.js

    insertCourses.js

    insertGroups.js

    insertGrades.js
```

## Примеры запросов:

### 1. Получить всех студентов:
```
db.Students.find().pretty();
```

### 2. Получить все курсы, которые ведёт определённый преподаватель:
```const teacherId = db.Teachers.findOne({ surname: "Калугин-Балашов" })._id;
db.Courses.find({ teacher_id: teacherId }).pretty();
```

### 3. Получить все оценки студента:
```const studentId = db.Students.findOne({ surname: "Иванов" })._id;
db.Grades.find({ student_id: studentId }).pretty();
```

### 4. Найти средний балл каждого студента
```db.Grades.aggregate([
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
```

### 5. Найти студентов, у которых есть хотя бы одна оценка выше 8
```db.Grades.aggregate([
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
```

### 6. Найти количество студентов на каждом факультете
```db.Students.aggregate([
  {
    $group: {
      _id: "$faculty",
      totalStudents: { $sum: 1 }
    }
  }
]);
```

### 7. Найти курсы, которые ведёт определённый преподаватель
```db.Teachers.aggregate([
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
```

### 8. Найти студентов, которые учатся на факультете "Факультет информатики" и имеют оценки выше 9
```db.Grades.aggregate([
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
```

### 9. Найти средний балл по каждому курсу
```db.Grades.aggregate([
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
```

### 10. Найти студентов, которые не получили ни одной оценки
```db.Students.aggregate([
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
```

### 11. Найти преподавателя с наибольшим количеством курсов
```db.Courses.aggregate([
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
```

### 12. Найти студентов, которые сдали все курсы на отлично (оценка 10)
```db.Grades.aggregate([
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
```

## На всякий случай приложу гайд, как подключиться через dbeaver:

#### 1.Подключаемся через Dbeaver, используя строку подключения:
mongodb://admin:admin@localhost:27017:
DBeaver Community Edition не поддерживает MongoDB "из коробки", но вы можете установить драйвер вручную.

    Открой DBeaver.

    Перейди в меню Database → Driver Manager.

    Нажми кнопку New для создания нового драйвера.

    Заполни поля:

        Driver Name: MongoDB

        Class Name: com.mongodb.client.MongoClient

        URL Template: mongodb://{host}:{port}

        Default Port: 27017

    На вкладке Libraries нажми Add File и добавь файл JAR-драйвера MongoDB(находится в корневой папке проекта)

    Нажми OK, чтобы сохранить драйвер.


#### 2. Создай подключение к MongoDB

    В DBeaver нажми Database → New Database Connection.

    Выбери MongoDB из списка баз данных.

    Заполни параметры подключения:

        Host: localhost (или IP-адрес сервера MongoDB).

        Port: 27017 (стандартный порт MongoDB).

        Database: Название базы (например, university).

        Authentication:

            Если используется аутентификация, укажи Username и Password (например, admin/admin, если вы использовались настройки из docker-compose.yml).

    Нажми Test Connection, чтобы проверить подключение.

    Если подключение успешно, нажми Finish.


