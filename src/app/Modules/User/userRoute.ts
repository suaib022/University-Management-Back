import express from 'express';
import { UserControllers } from './userController';

import { StudentValidations } from '../Student/StudentValidation';
import validateRequest from '../../middlewares/validateRequest';
import { createFacultyValidationSchema } from '../Faculty/facultyValidation';
import { createAdminValidationSchema } from '../Admin/admin.validation';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/create-student',
  auth('admin'),
  validateRequest(StudentValidations.CreateStudentValidationSchema),
  UserControllers.createStudent,
);

router.post(
  '/create-faculty',
  auth('admin'),
  validateRequest(createFacultyValidationSchema),
  UserControllers.createFaculty,
);

router.post(
  '/create-admin',
  auth('admin'),
  validateRequest(createAdminValidationSchema),
  UserControllers.createAdmin,
);

export const UserRoute = router;
