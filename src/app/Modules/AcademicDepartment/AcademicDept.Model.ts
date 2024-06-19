import { Schema, model } from 'mongoose';
import { TAcademicDepartment } from './AcademicDept.Interface';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const academicDepartmentSchema = new Schema<TAcademicDepartment>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicFaculty',
    },
  },
  {
    timestamps: true,
  },
);

// academicDepartmentSchema.pre('save', async function (next) {
//   const doesDepartmentExists = await AcademicDepartment.findOne({
//     name: this.name
//   });

//   if(doesDepartmentExists) {
//     throw new AppError(httpStatus.NOT_FOUND, 'Department exists already!')
//   }

//   next();
// })

academicDepartmentSchema.pre('findOneAndUpdate', async function (next) {
  const doesDepartmentExists = await AcademicDepartment.findOne(this.getQuery());

  if(!doesDepartmentExists) {
    throw new AppError(httpStatus.NOT_FOUND ,'Department does not exist!')
  }

  next();
})

export const AcademicDepartment = model<TAcademicDepartment>(
  'AcademicDepartment',
  academicDepartmentSchema,
);
