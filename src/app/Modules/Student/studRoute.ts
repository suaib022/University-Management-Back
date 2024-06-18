import express from 'express';
import { StudentController } from './studController';
import validateRequest from '../../middlewares/validateRequest';
import { updateStudentValidationSchema } from './StudentValidation';

const router = express.Router();

// router.post('/create-student', StudentController.createStudent);

router.get('/', StudentController.getAllStudents);

router.get('/:studentId', StudentController.getSingleStudent);

router.patch('/:studentId', validateRequest(updateStudentValidationSchema), StudentController.updateSingleStudent)

router.delete('/:studentId', StudentController.deleteStudent);

export const StudentRoutes = router;
