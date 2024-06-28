import express from 'express';
import { SemesterRegistrationControllers } from './semesterRegistration.controller';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationValidations } from './semesterRegistration.validation';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/create-semester-registration',
  auth('admin'),
  validateRequest(
    SemesterRegistrationValidations.createSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationControllers.createSemesterRegistration,
);

router.get(
  '/:id',
  auth('admin', 'faculty', 'student'),
  SemesterRegistrationControllers.getSingleSemesterRegistration,
);

router.patch(
  '/:id',
  auth('admin'),
  validateRequest(
    SemesterRegistrationValidations.updateSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationControllers.updateRegisteredSemester,
);

router.delete(
  '/:id',
  auth('admin'),
  SemesterRegistrationControllers.deleteRegisteredSemester,
);

router.get(
  '/',
  auth('admin', 'faculty', 'student'),
  SemesterRegistrationControllers.getAllSemesterRegistrations,
);

export const semesterRegistrationRoutes = router;
