import { TStudent } from './studInterface';
import { Student } from './studModel';

const createStudentIntoDB = async (studentData: TStudent) => {
  //statics method
  if (await Student.doesUserExist(studentData.id)) {
    throw new Error('User already exists!');
  }

  const result = await Student.create(studentData);

  // instance method
  // const student = new Student(studentData);
  // if (await student.doesUserExist(studentData.id)) {
  //   throw new Error('User already exists!');
  // }
  // const result = await student.save();
  return result;
};

const getAllStudentsFromDB = async () => {
  const result = await Student.find();
  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  // const result = await Student.findOne({ id });
  const result = await Student.aggregate([{ $match: { id: id } }]);
  return result;
};

const deleteStudentFromDB = async (id: string) => {
  const result = await Student.updateOne({ id }, { isDeleted: true });
  return result;
};

export const StudentServices = {
  createStudentIntoDB,
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
};
