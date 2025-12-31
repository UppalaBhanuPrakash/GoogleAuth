import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

export const getUser = catchAsync(async (req, res, next) => {
  const user = null; // simulate DB response

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: user
  });
});
