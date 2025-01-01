import { academicSemesterNameCodeMapper } from './academicSemester.constant';
import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemester } from './academicSemester.model';

const createAcademicSemesterIntoDB = async (
  semesterData: TAcademicSemester,
) => {
  // semester name is reated to semester code
  if (academicSemesterNameCodeMapper[semesterData.name] !== semesterData.code) {
    throw new Error('Invalid Semester Code!');
  }
  const result = await AcademicSemester.create(semesterData);
  return result;
};

const getAllAcademicSemestersFromDB = async () => {
  const result = await AcademicSemester.find();
  return result;
};

const getSingleAcademicSemesterFromDB = async (id: string) => {
  const result = await AcademicSemester.findById(id);
  return result;
};

const updateAcademicSemesterIntoDB = async (
  id: string,
  semesterData: Partial<TAcademicSemester>,
) => {
  if (
    semesterData.name &&
    semesterData.code &&
    academicSemesterNameCodeMapper[semesterData.name] !== semesterData.code
  ) {
    throw new Error('Invalid Semester Code');
  }

  const result = await AcademicSemester.findByIdAndUpdate(id, semesterData, {
    new: true,
  });
  return result;
};

export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB,
  getAllAcademicSemestersFromDB,
  getSingleAcademicSemesterFromDB,
  updateAcademicSemesterIntoDB,
};
