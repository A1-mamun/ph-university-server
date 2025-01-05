import config from '../../config';
import httpStatus from 'http-status';
import AppError from '../../errors/AppErrors';
import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';
import mongoose from 'mongoose';

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

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    //   set generated id
    userData.id = await generateStudentId(
      academicSemester as TAcademicSemester,
    );

    //   create a user (transaction 1)
    const newUser = await User.create([userData], { session });

    // faild to create user
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }
    //    set id, _id as user
    studentData.id = newUser[0].id;
    studentData.user = newUser[0]._id; // reference to user

    // create a student (transaction 2)
    const newStudent = await Student.create([studentData], { session });

    // faild to create student
    if (!newStudent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student');
    }

    await session.commitTransaction();
    await session.endSession();
    return newStudent;
  } catch {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student');
  }
};
export const UserServices = {
  createStudentIntoDB,
};
