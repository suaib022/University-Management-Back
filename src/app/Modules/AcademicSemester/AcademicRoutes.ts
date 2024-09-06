import express from 'express';
import { AcademicSemesterControllers } from './AcademicController';
import validateRequest from '../../middlewares/validateRequest';
import {
  CreateAcademicSemesterValidationSchema,
  UpdateAcademicSemesterValidationSchema,
} from './AcademicValidation';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/create-academic-semester',
  validateRequest(CreateAcademicSemesterValidationSchema),
  AcademicSemesterControllers.CreateAcademicSemester,
);

router.get(
  '/',
  auth('admin'),
  AcademicSemesterControllers.getAllAcademicSemesters,
);

router.get(
  '/:semesterId',
  AcademicSemesterControllers.getSingleAcademicSemester,
);

router.patch(
  '/:semesterId',
  validateRequest(UpdateAcademicSemesterValidationSchema),
  AcademicSemesterControllers.updateSingleAcademicSemester,
);

export const AcademicSemesterRoutes = router;
