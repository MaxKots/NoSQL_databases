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
