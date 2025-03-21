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
