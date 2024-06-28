import express from 'express';
import { StudentController } from './studController';
import validateRequest from '../../middlewares/validateRequest';
import { updateStudentValidationSchema } from './StudentValidation';
import auth from '../../middlewares/auth';

const router = express.Router();

// router.post('/create-student', StudentController.createStudent);

router.get(
  '/',
  auth('admin', 'faculty', 'student'),
  StudentController.getAllStudents,
);

router.get(
  '/:studentId',
  auth('admin', 'faculty', 'student'),
  StudentController.getSingleStudent,
);

router.patch(
  '/:studentId',
  auth('admin'),
  validateRequest(updateStudentValidationSchema),
  StudentController.updateSingleStudent,
);

router.delete('/:studentId', auth('admin'), StudentController.deleteStudent);

export const StudentRoutes = router;
