import { Model, Types } from 'mongoose';

export type TGuardian = {
  fatherName: string;
  fatherOccupation: string;
  fatherContactNo: string;
  motherName: string;
  motherOccupation: string;
  motherContactNo: string;
};

export type TUserName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type TLocalGuardian = {
  name: string;
  occupation: string;
  contactNo: string;
  address: string;
};

export type TStudent = {
  id: string;
  user: Types.ObjectId;
  name: TUserName;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  contactNo: string;
  emergencyContactNo: string;
  email: string;
  avatar?: string;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  presentAddress: string;
  permanentAddress: string;
  guardian: TGuardian;
  localGuardian: TLocalGuardian;
  profileImage?: string;
  admissionSemester: Types.ObjectId;
  isDeleted: boolean;
  academicDepartment: Types.ObjectId;
};

//to create static
export interface StudentModel extends Model<TStudent> {
  doesUserExist(id: string): Promise<TStudent | null>;
}

//to create instance
// export type StudentMethod = {
//   doesUserExist(id: string): Promise<TStudent | null>;
// };

// export type StudentModel = Model<
//   TStudent,
//   Record<string, never>,
//   StudentMethod
// >;
