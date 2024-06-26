import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { SemesterRegistration } from '../SemesterRegistration/semesterRegistration.model';
import { TOfferedCourse } from './offeredCourse.interface';
import { AcademicFaculty } from '../AcademicFaculty/AcademicFacultyModel';
import { AcademicDepartment } from '../AcademicDepartment/AcademicDept.Model';
import { Course } from '../Course/courseModel';
import { Faculty } from '../Faculty/faculty.model';
import { OfferedCourse } from './offeredCourse.model';
import { hasTimeConflict } from './offeredCourse.utils';
import QueryBuilder from '../../builder/QueryBuilder';
import { AcademicSemester } from '../AcademicSemester/AcademicModel';

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicDepartment,
    academicFaculty,
    course,
    section,
    faculty,
    days,
    startTime,
    endTime,
  } = payload;

  /**
   * 1. check the existence of semesterRegistration in DB
   * 2. check the existence of academic faculty in DB
   * 3. check the existence of academic department in DB
   * 4. check the existence of course in DB
   * 5. check the existence of faculty in DB
   * 6. check the existence of academic semester
   * 7. check if the dept belong to the faculty
   * 8. check duplicate possibility of offered course of same section in same registered semester
   * 9. check the schedule of faculty
   * 10. check the availability of faculty according to schedule
   * 11. create offered course
   */

  // step - 1
  const doesSemesterRegistrationExist =
    await SemesterRegistration.findById(semesterRegistration);

  if (!doesSemesterRegistrationExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Registered semester Not Found !');
  }

  // step - 2
  const doesAcademicFacultyExits =
    await AcademicFaculty.findById(academicFaculty);

  if (!doesAcademicFacultyExits) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Faculty not found !');
  }

  // step - 3
  const doesAcademicDepartmentExits =
    await AcademicDepartment.findById(academicDepartment);

  if (!doesAcademicDepartmentExits) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Department not found !');
  }

  // step - 4
  const doesCourseExits = await Course.findById(course);

  if (!doesCourseExits) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found !');
  }

  // step - 5
  const doesFacultyExits = await Faculty.findById(faculty);

  if (!doesFacultyExits) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found !');
  }

  // step - 6
  const academicSemester = payload?.academicSemester;
  const doesAcademicSemesterExist =
    await AcademicSemester.findById(academicSemester);

  if (!doesAcademicSemesterExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Requested Academic Semester Not Found !',
    );
  }

  // step - 7
  const doesDepartmentBelongToFaculty = await AcademicDepartment.findOne({
    _id: academicDepartment,
    academicFaculty,
  });

  if (!doesDepartmentBelongToFaculty) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Dept : ${doesAcademicDepartmentExits.name} does not belong to faculty : ${doesAcademicFacultyExits.name}`,
    );
  }

  // step - 8
  const doesSameOfferedCourseExistWithSameRegisteredSemesterAndSameSection =
    await OfferedCourse.findOne({
      semesterRegistration,
      course,
      section,
    });

  if (doesSameOfferedCourseExistWithSameRegisteredSemesterAndSameSection) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Offered course with same section is already exist!`,
    );
  }

  // step - 9 & 10
  const assignedSchedules = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');

  const newSchedule = {
    days,
    startTime,
    endTime,
  };

  if (hasTimeConflict(assignedSchedules, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      `This faculty is not available at that time ! Choose other time or day`,
    );
  }

  // step - 11
  const result = await OfferedCourse.create({ ...payload, academicSemester });

  return result;
};

const getAllOfferedCoursesFromDB = async (query: Record<string, unknown>) => {
  const offeredCourseQuery = new QueryBuilder(OfferedCourse.find(), query)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await offeredCourseQuery.modelQuery;
  return result;
};

const getSingleOfferedCourseFromDB = async (id: string) => {
  const offeredCourse = await OfferedCourse.findById(id);

  if (!offeredCourse) {
    throw new AppError(404, 'Offered Course not found');
  }

  return offeredCourse;
};

const updateOfferedCourseInDB = async (
  id: string,
  payload: Pick<TOfferedCourse, 'faculty' | 'days' | 'startTime' | 'endTime'>,
) => {
  /**
   * 1. check existence of offered course
   * 2. check existence of faculty
   * 3. check status of registered semester
   * 4. check the availability of faculty
   * 5. update offered course
   */

  const { faculty, days, startTime, endTime } = payload;

  // step - 1
  const doesOfferedCourseExist = await OfferedCourse.findById(id);

  if (!doesOfferedCourseExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered course not found !');
  }

  // step - 2
  const doesFacultyExist = await Faculty.findById(faculty);

  if (!doesFacultyExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found !');
  }

  // step - 3
  const registeredSemesterId = doesOfferedCourseExist.semesterRegistration;
  const registeredSemester =
    await SemesterRegistration.findById(registeredSemesterId);

  if (registeredSemester?.status !== 'UPCOMING') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not update this offered course as it is ${registeredSemester?.status}`,
    );
  }

  // step - 4
  const semesterRegistration = doesOfferedCourseExist.semesterRegistration;
  const assignedSchedules = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');

  const newSchedule = {
    days,
    startTime,
    endTime,
  };

  if (hasTimeConflict(assignedSchedules, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      `This faculty is not available at that time ! Choose other time or day`,
    );
  }

  const result = await OfferedCourse.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

const deleteOfferedCourseFromDB = async (id: string) => {
  /**
   * 1. check the existence of offered course
   * 2. check the status of registered semester
   * 3. delete offered course
   */
  const doesOfferedCourseExist = await OfferedCourse.findById(id);

  if (!doesOfferedCourseExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered Course not found');
  }

  const semesterRegistration = doesOfferedCourseExist.semesterRegistration;

  const semesterRegistrationStatus =
    await SemesterRegistration.findById(semesterRegistration).select('status');

  if (semesterRegistrationStatus?.status !== 'UPCOMING') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Offered course can not be updated ! because the semester is ${semesterRegistrationStatus?.status}`,
    );
  }

  const result = await OfferedCourse.findByIdAndDelete(id);

  return result;
};

export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
  getAllOfferedCoursesFromDB,
  getSingleOfferedCourseFromDB,
  deleteOfferedCourseFromDB,
  updateOfferedCourseInDB,
};
