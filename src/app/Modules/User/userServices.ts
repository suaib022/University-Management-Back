import config from '../../config';
import { AcademicSemester } from '../AcademicSemester/AcademicModel';
import { TStudent } from '../Student/studInterface';
import { Student } from '../Student/studModel';
import { generateStudentId } from './UserUtils';
import { TUser } from './userInterface';
import { User } from './userModel';

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

  // manually generated id
  userData.id = await generateStudentId(admissionSemester);

  // create a user
  const newUser = await User.create(userData);

  // create a student
  if (Object.keys(newUser).length) {
    // set id, _id as user
    payLoad.id = newUser.id;
    payLoad.user = newUser._id;

    const newStudent = await Student.create(payLoad);
    return newStudent;
  }

  //   return result;
};

export const UserServices = {
  createStudentIntoDB,
};
