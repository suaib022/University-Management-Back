const USER_ROLE = {
  admin: 'admin',
  faculty: 'faculty',
  student: 'student',
};

export default USER_ROLE;

export type TUserRole = keyof typeof USER_ROLE;
