import express from 'express';
import { SemesterRegistrationControllers } from './semesterRegistration.controller';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationValidations } from './semesterRegistration.validation';

const router = express.Router();

router.post(
    '/create-semester-registration',
    validateRequest(
        SemesterRegistrationValidations.createSemesterRegistrationValidationSchema,
    ),
    SemesterRegistrationControllers.createSemesterRegistration,
);

router.get(
    '/:id',
    SemesterRegistrationControllers.getSingleSemesterRegistration,
);

router.patch(
    '/:id',
    validateRequest(
        SemesterRegistrationValidations.updateSemesterRegistrationValidationSchema,
    ),
    SemesterRegistrationControllers.updateRegisteredSemester,
);

router.get(
    '/:id',
    SemesterRegistrationControllers.getSingleSemesterRegistration,
);

router.delete(
    '/:id',
    SemesterRegistrationControllers.deleteRegisteredSemester,
);

router.get('/', SemesterRegistrationControllers.getAllSemesterRegistrations);

export const semesterRegistrationRoutes = router;