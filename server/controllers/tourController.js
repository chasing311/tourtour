const Tour = require("../models/tourModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: "reviews" });
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "price,-ratingsAverage";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stages = [
    {
      $match: {
        ratingsAverage: { $gte: 4.5 },
      },
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        numTours: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    {
      $match: { _id: { $ne: "EASY" } },
    },
  ];
  const stats = await Tour.aggregate(stages);

  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const stags = [
    {
      // Deconstructs an array field from the input documents to output a document for each element.
      $unwind: "$startDates",
    },
    {
      $match: {
        // filtering tours in this year
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        // convert month to number
        _id: { $month: "$startDates" },
        // calculating the number of tours starting in the month
        numTourStarts: { $sum: 1 },
        // get the name of tours
        // The $push operator appends a specified value to an array.
        tours: { $push: "$name" },
      },
    },
    {
      $addFields: { month: "$_id" },
    },
    {
      // Passes along the documents with the requested fields to the next stage in the pipeline.
      // Fields can be existing fields from the input documents or newly computed fields.
      // _id: <0 or false> : Specifies the suppression of the _id field.
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $limit: 12,
    },
  ];
  const plan = await Tour.aggregate(stags);

  res.status(200).json({
    status: "success",
    data: {
      plan,
    },
  });
});
