const { throwError } = require("./CustomError");

exports.pagination = async (model, pipeline, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const facetPipeline = [
    ...pipeline,
    {
      $facet: {
        data: [{ $skip: skip }, { $limit: parseInt(limit) }],
        totalCount: [{ $count: "count" }],
      },
    },
    {
      $project: {
        data: 1,
        totalCount: { $arrayElemAt: ["$totalCount.count", 0] },
      },
    },
  ];
  const result = await model.aggregate(facetPipeline);
  const { data, totalCount = 0 } = result[0] || {};
  if (!data || data.length === 0) throwError(404, "No data found");
  return {
    total: totalCount,
    totalPages: Math.ceil(totalCount / limit),
    page: parseInt(page),
    limit: parseInt(limit),
    data,
  };
};
