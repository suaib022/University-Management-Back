import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicDepartmentValidations } from './AcademicDept.Validations';
import { AcademicDepartmentControllers } from './AcademicDept.Controllers';
import auth from '../../middlewares/auth';
const router = express.Router();

router.post(
  '/create-academic-department',
  auth('admin'),
  validateRequest(
    AcademicDepartmentValidations.createAcademicDepartmentValidationSchema,
  ),
  AcademicDepartmentControllers.createAcademicDepartment,
);

router.get(
  '/',
  auth('admin', 'faculty', 'student'),
  AcademicDepartmentControllers.getAllAcademicDepartments,
);

router.get(
  '/:departmentId',
  auth('admin', 'faculty', 'student'),
  AcademicDepartmentControllers.getSingleAcademicDepartment,
);

router.patch(
  '/:departmentId',
  auth('admin'),
  validateRequest(
    AcademicDepartmentValidations.updateAcademicDepartmentValidationSchema,
  ),
  AcademicDepartmentControllers.updateAcademicDepartment,
);

export const AcademicDepartmentRoutes = router;
