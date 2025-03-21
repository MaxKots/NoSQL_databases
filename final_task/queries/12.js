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
