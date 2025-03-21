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
