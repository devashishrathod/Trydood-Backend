exports.sendSuccess = (
  res,
  message = "Success",
  data = {},
  statusCode = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

exports.sendError = (
  res,
  message = "Something went wrong",
  statusCode = 500,
  errorData = {}
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: errorData,
  });
};
