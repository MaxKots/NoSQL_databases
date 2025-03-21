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
