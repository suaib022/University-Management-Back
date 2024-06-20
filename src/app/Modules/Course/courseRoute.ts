import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CourseValidations } from './courseValidation';
import { courseControllers } from './courseController';

const router = express.Router();

router.post('/create-course', validateRequest(CourseValidations.createCourseValidationSchema), courseControllers.createCourse);

router.get('/', courseControllers.getAllCourses);

router.get('/:id', courseControllers.getSingleCourse);

router.patch(
    '/:id',
    validateRequest(CourseValidations.updateCourseValidationSchema),
    courseControllers.updateCourse,
);

router.delete('/:id', courseControllers.deleteCourse);

export const CourseRoutes = router;