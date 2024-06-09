import express from 'express';
import { UserController } from './userController';

import { StudentValidations } from '../Student/StudentValidation';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router.post(
  '/create-student',
  validateRequest(StudentValidations.CreateStudentValidationSchema),
  UserController.createStudent,
);

export const UserRoute = router;
