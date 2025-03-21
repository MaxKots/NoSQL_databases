db.Students.aggregate([
  {
    $group: {
      _id: "$faculty",
      totalStudents: { $sum: 1 }
    }
  }
]);
