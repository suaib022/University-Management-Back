import express from 'express';
import { UserControllers } from './userController';

import { StudentValidations } from '../Student/StudentValidation';
import validateRequest from '../../middlewares/validateRequest';
import { createFacultyValidationSchema } from '../Faculty/facultyValidation';
import { createAdminValidationSchema } from '../Admin/admin.validation';

const router = express.Router();

router.post(
  '/create-student',
  validateRequest(StudentValidations.CreateStudentValidationSchema),
  UserControllers.createStudent,
);

router.post(
  '/create-faculty',
  validateRequest(createFacultyValidationSchema),
  UserControllers.createFaculty,
);

router.post('/create-admin', validateRequest(createAdminValidationSchema), UserControllers.createAdmin)

export const UserRoute = router;
