import express, { NextFunction, Request, Response } from 'express';
import { UserControllers } from './userController';

import { StudentValidations } from '../Student/StudentValidation';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { FacultyValidations } from '../Faculty/facultyValidation';
import { AdminValidations } from '../Admin/admin.validation';
import { UserValidation } from './userValidation';
import { upload } from '../../utils/sendImageToCloudinary';

const router = express.Router();

router.post(
  '/create-student',
  auth('admin'),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(StudentValidations.CreateStudentValidationSchema),
  UserControllers.createStudent,
);

router.post(
  '/create-faculty',
  auth('admin'),
  validateRequest(FacultyValidations.createFacultyValidationSchema),
  UserControllers.createFaculty,
);

router.post(
  '/create-admin',
  // auth('admin'),
  validateRequest(AdminValidations.createAdminValidationSchema),
  UserControllers.createAdmin,
);

router.post(
  '/change-status/:id',
  auth('admin'),
  validateRequest(UserValidation.changeStatusValidationSchema),
  UserControllers.changeStatus,
);

router.get('/me', auth('student', 'admin', 'faculty'), UserControllers.getMe);

export const UserRoute = router;
