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
