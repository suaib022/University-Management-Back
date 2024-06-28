import express from 'express';
import { AdminControllers } from './admin.controller';
import validateRequest from '../../middlewares/validateRequest';
import { updateAdminValidationSchema } from './admin.validation';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get('/', auth('admin'), AdminControllers.getAllAdmins);

router.get('/:adminId', auth('admin'), AdminControllers.getSingleAdmin);

router.patch(
  '/:adminId',
  auth('admin'),
  validateRequest(updateAdminValidationSchema),
  AdminControllers.updateAdmin,
);

router.delete('/:adminId', auth('admin'), AdminControllers.deleteAdmin);

export const AdminRoutes = router;
