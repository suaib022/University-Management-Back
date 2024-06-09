import { academicSemesterNameCodeMapper } from './AcademicConst';
import { TAcademicSemester } from './AcademicInterface';
import { AcademicSemester } from './AcademicModel';

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
  // check semester name and code matching

  if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
    throw new Error('Invalid Semester Code!');
  }
  const result = await AcademicSemester.create(payload);

  return result;
};

const getAllAcademicSemestersFromDB = async () => {
  const result = await AcademicSemester.find();
  return result;
};

const getSingleAcademicSemesterFromDB = async (_id: string) => {
  const result = await AcademicSemester.findOne({ _id });
  return result;
};

const updateSingleAcademicSemesterInDB = async (
  _id: string,
  payload: Partial<TAcademicSemester>,
) => {
  if (
    payload.name &&
    payload.code &&
    academicSemesterNameCodeMapper[payload.name] !== payload.code
  ) {
    throw new Error('Invalid semester code!');
  }
  const result = await AcademicSemester.updateOne({ _id }, { $set: payload });
  return result;
};

export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB,
  getAllAcademicSemestersFromDB,
  getSingleAcademicSemesterFromDB,
  updateSingleAcademicSemesterInDB,
};
