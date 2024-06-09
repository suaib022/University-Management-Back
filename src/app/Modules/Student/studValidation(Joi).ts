import Joi from 'joi';

const LocalGuardianValidationSchema = Joi.object({
  name: Joi.string().required(),
  occupation: Joi.string().required(),
  contactNo: Joi.string().required(),
  address: Joi.string().required(),
});

const GuardianValidationSchema = Joi.object({
  fatherName: Joi.string().required(),
  fatherOccupation: Joi.string().required(),
  fatherContactNo: Joi.string().required(),
  motherName: Joi.string().required(),
  motherOccupation: Joi.string().required(),
  motherContactNo: Joi.string().required(),
});

const userNameValidationSchema = Joi.object({
  firstName: Joi.string().required().max(20).trim(),
  middleName: Joi.string().optional(),
  lastName: Joi.string().required().max(20),
});

const StudentValidationSchemaWithJoi = Joi.object({
  id: Joi.string().required(),
  name: userNameValidationSchema.required(),
  gender: Joi.string().valid('male', 'female', 'other').required(),
  dateOfBirth: Joi.string().required(),
  email: Joi.string().email().required(),
  contactNo: Joi.string().required(),
  emergencyContactNo: Joi.string().required(),
  bloodGroup: Joi.string()
    .valid('A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-')
    .optional(),
  presentAddress: Joi.string().required(),
  permanentAddress: Joi.string().required(),
  guardian: GuardianValidationSchema.required(),
  localGuardian: LocalGuardianValidationSchema.required(),
  profileImage: Joi.string().required(),
  isActive: Joi.string()
    .valid('active', 'inActive')
    .default('active')
    .required(),
});

export default StudentValidationSchemaWithJoi;
