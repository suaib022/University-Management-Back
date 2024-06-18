import mongoose from 'mongoose';
import config from '../../config';
import { AcademicSemester } from '../AcademicSemester/AcademicModel';
import { TStudent } from '../Student/studInterface';
import { Student } from '../Student/studModel';
import { generateStudentId } from './UserUtils';
import { TUser } from './userInterface';
import { User } from './userModel';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createStudentIntoDB = async (password: string, payLoad: TStudent) => {
  //statics method
  //   if (await Student.doesUserExist(payLoad.id)) {
  //     throw new Error('User already exists!');
  //   }
  const userData: Partial<TUser> = {};

  // if password is not provided
  userData.password = password || (config.default_pass as string);

  // set student role
  userData.role = 'student';

  //find academic semester info
  const admissionSemester = await AcademicSemester.findById(
    payLoad.admissionSemester,
  );

  const session = await mongoose.startSession();

  try {

    session.startTransaction();
    // manually generated id
    userData.id = await generateStudentId(admissionSemester);

    // create a user
    const newUser = await User.create([userData], { session });

    // create a student
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed To Create User')
    }
    // set id, _id as user
    payLoad.id = newUser[0].id;
    payLoad.user = newUser[0]._id;

    const newStudent = await Student.create([payLoad], { session });
    if (!newStudent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed To Create Student')
    }

    await session.commitTransaction();
    await session.endSession()
    return newStudent;
  }
  catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed To Create Student')
  }
};

export const UserServices = {
  createStudentIntoDB,
};
