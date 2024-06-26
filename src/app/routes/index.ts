import { Router } from 'express';
import { UserRoute } from '../Modules/User/userRoute';
import { StudentRoutes } from '../Modules/Student/studRoute';
import { AcademicSemesterRoutes } from '../Modules/AcademicSemester/AcademicRoutes';
import { AcademicFacultyRoutes } from '../Modules/AcademicFaculty/AcademicFacultyRoutes';
import { AcademicDepartmentRoutes } from '../Modules/AcademicDepartment/AcademicDept.Routes';
import { CourseRoutes } from '../Modules/Course/courseRoute';
import { FacultyRoutes } from '../Modules/Faculty/faculty.route';
import { AdminRoutes } from '../Modules/Admin/admin.route';
import { semesterRegistrationRoutes } from '../Modules/SemesterRegistration/semesterRegistration.route';
import { offeredCourseRoutes } from '../Modules/OfferedCourse/offeredCourse.route';

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
    path: '/faculties',
    route: FacultyRoutes
  },
  {
    path: '/admins',
    route: AdminRoutes
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
  {
    path: '/courses',
    route: CourseRoutes
  },
  {
    path: '/semester-registrations',
    route: semesterRegistrationRoutes,
  },
  {
    path: '/offered-courses',
    route: offeredCourseRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
