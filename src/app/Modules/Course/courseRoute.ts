import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CourseValidations } from './courseValidation';
import { courseControllers } from './courseController';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/create-course',
  auth('admin'),
  validateRequest(CourseValidations.createCourseValidationSchema),
  courseControllers.createCourse,
);

router.get(
  '/',
  auth('admin', 'faculty', 'student'),
  courseControllers.getAllCourses,
);

router.get(
  '/:id',
  auth('admin', 'faculty', 'student'),
  courseControllers.getSingleCourse,
);

router.patch(
  '/:id',
  auth('admin'),
  validateRequest(CourseValidations.updateCourseValidationSchema),
  courseControllers.updateCourse,
);

router.delete('/:id', auth('admin'), courseControllers.deleteCourse);

export const CourseRoutes = router;
