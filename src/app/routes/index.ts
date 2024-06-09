import { Router } from 'express';
import { UserRoute } from '../Modules/User/userRoute';
import { StudentRoutes } from '../Modules/Student/studRoute';
import { AcademicSemesterRoutes } from '../Modules/AcademicSemester/AcademicRoutes';
import { AcademicFacultyRoutes } from '../Modules/AcademicFaculty/AcademicFacultyRoutes';
import { AcademicDepartmentRoutes } from '../Modules/AcademicDepartment/AcademicDept.Routes';

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
  {
    path: '/academic-faculties',
    route: AcademicFacultyRoutes,
  },
  {
    path: '/academic-departments',
    route: AcademicDepartmentRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
