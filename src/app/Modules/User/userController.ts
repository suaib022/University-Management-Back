import { UserServices } from './userServices';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

const createStudent = catchAsync(async (req, res) => {
  const { password, student: studentData } = req.body;

  // validation using zod
  //   const zodParsedData = StudentValidationSchema.parse(studentData);
  const result = await UserServices.createStudentIntoDB(password, studentData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Students created successfully',
    data: result,
  });
});

export const UserController = {
  createStudent,
};
