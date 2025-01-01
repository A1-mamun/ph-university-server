import config from '../../config';
import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';

const createStudentIntoDB = async (password: string, studentData: TStudent) => {
  // create a user object
  const userData: Partial<TUser> = {};

  // if password is not provided, then set the default password
  userData.password = password || (config.default_password as string);

  //   set student role
  userData.role = 'student';

  // find academic semester info
  const academicSemester = await AcademicSemester.findById(
    studentData.academicSemester,
  );

  //   set generated id
  userData.id = await generateStudentId(academicSemester as TAcademicSemester);

  //   create a user
  const newUser = await User.create(userData);

  //   create a student
  if (Object.keys(newUser).length) {
    //    set id, _id as user
    studentData.id = newUser.id;
    studentData.user = newUser._id; // reference to user

    const newStudent = await Student.create(studentData);
    return newStudent;
  }
};
export const UserServices = {
  createStudentIntoDB,
};
