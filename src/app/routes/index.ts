import { Router } from 'express';
import { UserRoute } from '../Modules/User/userRoute';
import { StudentRoutes } from '../Modules/Student/studRoute';
import { AcademicSemesterRoutes } from '../Modules/AcademicSemester/AcademicRoutes';

const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoute,
  },
  {
    path: '/students',
    route: StudentRoutes,
  },
  {
    path: '/academic-semesters',
    route: AcademicSemesterRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
