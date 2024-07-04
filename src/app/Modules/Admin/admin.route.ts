import express from 'express';
import { AdminControllers } from './admin.controller';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { AdminValidations } from './admin.validation';

const router = express.Router();

router.get('/', auth('admin'), AdminControllers.getAllAdmins);

router.get('/:adminId', auth('admin'), AdminControllers.getSingleAdmin);

router.patch(
  '/:adminId',
  auth('admin'),
  validateRequest(AdminValidations.updateAdminValidationSchema),
  AdminControllers.updateAdmin,
);

router.delete('/:adminId', auth('admin'), AdminControllers.deleteAdmin);

export const AdminRoutes = router;
