import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicFacultyControllers } from './AcademicFacultyControllers';
import { AcademicFacultyValidation } from './AcademicFacultyValidation';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/create-academic-faculty',
  auth('admin'),
  validateRequest(
    AcademicFacultyValidation.createAcademicFacultyValidationSchema,
  ),
  AcademicFacultyControllers.createAcademicFaculty,
);

router.get(
  '/',
  auth('admin', 'faculty', 'student'),
  AcademicFacultyControllers.getAllAcademicFaculties,
);

router.get(
  '/:facultyId',
  auth('admin', 'faculty', 'student'),
  AcademicFacultyControllers.getSingleAcademicFaculty,
);

router.patch(
  '/:facultyId',
  auth('admin'),
  validateRequest(
    AcademicFacultyValidation.updateAcademicFacultyValidationSchema,
  ),
  AcademicFacultyControllers.updateAcademicFaculty,
);

export const AcademicFacultyRoutes = router;
