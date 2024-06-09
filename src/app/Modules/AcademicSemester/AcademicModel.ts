import { Schema, model } from 'mongoose';
import { TAcademicSemester } from './AcademicInterface';
import { Months, SemesterCodes, SemesterNames } from './AcademicConst';

const AcademicSemesterSchema = new Schema<TAcademicSemester>({
  name: {
    type: String,
    required: true,
    enum: SemesterNames,
  },
  year: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    enum: SemesterCodes,
  },
  startMonth: {
    type: String,
    enum: Months,
    required: true,
  },
  endMonth: {
    type: String,
    enum: Months,
    requires: true,
  },
});

AcademicSemesterSchema.pre('save', async function (next) {
  const doesSemesterExist = await AcademicSemester.findOne({
    year: this.year,
    name: this.name,
  });

  if (doesSemesterExist) {
    throw new Error('Semester exists already!');
  }

  next();
});

export const AcademicSemester = model<TAcademicSemester>(
  'AcademicSemester',
  AcademicSemesterSchema,
);
