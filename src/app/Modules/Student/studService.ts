import mongoose from 'mongoose';
import { TStudent } from './studInterface';
import { Student } from './studModel';
import { User } from '../User/userModel';
import QueryBuilder from '../../builder/QueryBuilder';

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

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
  // const queryObj = { ...query };

  // let searchTerm = '';

  // if (query?.searchTerm) {
  //   searchTerm = query?.searchTerm as string;
  // };

  // const searchQuery = Student.find({
  //   $or: studentSearchAbleFields.map((field) => ({
  //     [field]: { $regex: searchTerm, $options: 'i' }
  //   }))
  // });

  // const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
  // excludeFields.forEach((elem) => delete queryObj[elem]);

  // const filterQuery = searchQuery.find(queryObj).populate('admissionSemester').populate({
  //   path: 'academicDepartment',
  //   populate: {
  //     path: 'academicFaculty'
  //   }
  // });

  // let sort = '-createdAt';
  
  // if(query?.sort && typeof query.sort === 'string') {
  //   sort = query.sort as string;
  // }

  // const sortQuery = filterQuery.sort(sort);

  // let page = 1;
  // let limit = 1;
  // let skip = 0;

  // if(query?.limit) {
  //   limit = Number(query?.limit);
  // };

  // if(query?.page) {
  //   page = Number(query?.page);
  //   skip = (page - 1) * limit;
  // }

  // const paginateQuery = sortQuery.skip(skip);

  // const limitQuery = paginateQuery.limit(limit)

  // let fields = '-__v';

  // if(query?.fields) {
  //   fields = (query?.fields as string).split(',').join(' ');
  // }

  // const fieldQuery = await limitQuery.select(fields);

  // return fieldQuery;

  const studentSearchAbleFields = ['email', 'name.firstName', 'presentAddress'];

  const studentQuery = new QueryBuilder(
    Student.find().populate('admissionSemester').populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty'
      }
    }),
    query
  ).search(studentSearchAbleFields).filter().sort().paginate().fields();

  const result = await studentQuery.modelQuery;
  return result;

};

const getSingleStudentFromDB = async (id: string) => {
  // const result = await Student.findOne({ id });
  const result = await Student.findOne({ id }).populate({
    path: 'academicDepartment',
    populate: {
      path: 'academicFaculty'
    }
  });;
  return result;
};

const updateSingleStudentInDB = async (id: string, payLoad: Partial<TStudent>) => {
  const { name, guardian, localGuardian, ...remainingStudentData } = payLoad;

  const updatedStudentData: Record<string, unknown> = {
    ...remainingStudentData
  }

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      updatedStudentData[`name.${key}`] = value;
    }
  }

  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      updatedStudentData[`guardian.${key}`] = value;
    }
  }

  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      updatedStudentData[`localGuardian.${key}`] = value;
    }
  }

  const result = await Student.findOneAndUpdate({ id }, updatedStudentData, { new: true, runValidators: true });

  return result;
}

const deleteStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deletedStudent = await Student.findOneAndUpdate({ id }, { isDeleted: true }, { new: true, session })

    if (!deletedStudent) {
      throw new Error('Failed To Delete Student!')
    }

    const deletedUser = await User.findOneAndUpdate({ id }, { isDeleted: true }, { new: true, session })

    if (!deletedUser) {
      throw new Error('Failed To Delete User!')
    }
    await session.commitTransaction();
    await session.endSession();
    return deletedStudent;
  }
  catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error('Failed To Delete Student!')
  }
};

export const StudentServices = {
  createStudentIntoDB,
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  updateSingleStudentInDB,
  deleteStudentFromDB,
};
