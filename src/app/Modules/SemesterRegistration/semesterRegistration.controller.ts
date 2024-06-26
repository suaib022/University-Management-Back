import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { SemesterRegistrationServices } from './semesterRegistration.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const createSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await SemesterRegistrationServices.createSemesterRegistrationIntoDB(
        req?.body,
      );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester registered successfully !',
      data: result,
    });
  },
);

const getAllSemesterRegistrations = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await SemesterRegistrationServices.getAllSemesterRegistrationsFromDB(
        req.query,
      );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester registrations are retrieved successfully!',
      data: result,
    });
  },
);

const getSingleSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result =
      await SemesterRegistrationServices.getSingleSemesterRegistrationsFromDB(
        id,
      );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester Registration is retrieved successfully',
      data: result,
    });
  },
);

const updateRegisteredSemester = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await SemesterRegistrationServices.updateRegisteredSemesterInDB(
        id,
        req.body,
      );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester Registration is updated successfully',
      data: result,
    });
  },
);

const deleteRegisteredSemester = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await SemesterRegistrationServices.deleteRegisteredSemesterFromDB(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester Registration is deleted successfully',
      data: result,
    });
  },
);

export const SemesterRegistrationControllers = {
  createSemesterRegistration,
  getAllSemesterRegistrations,
  getSingleSemesterRegistration,
  updateRegisteredSemester,
  deleteRegisteredSemester,
};
