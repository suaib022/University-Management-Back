import express from 'express';
import { FacultyControllers } from './faculty.controller';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { FacultyValidations } from './facultyValidation';
const router = express.Router();

router.get(
  '/:id',
  auth('admin', 'faculty', 'student'),
  FacultyControllers.getSingleFaculty,
);

router.patch(
  '/:id',
  auth('admin'),
  validateRequest(FacultyValidations.updateFacultyValidationSchema),
  FacultyControllers.updateFaculty,
);

router.delete('/:id', auth('admin'), FacultyControllers.deleteFaculty);

router.get(
  '/',
  auth('admin', 'faculty', 'student'),
  FacultyControllers.getAllFaculties,
);

export const FacultyRoutes = router;
