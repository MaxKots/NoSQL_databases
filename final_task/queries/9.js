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
