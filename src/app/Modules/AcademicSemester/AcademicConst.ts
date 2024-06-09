import {
  TAcademicSemesterNameCodeMapper,
  TMonths,
  TSemesterCodes,
  TSemesterNames,
} from './AcademicInterface';

export const Months: TMonths[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const SemesterNames: TSemesterNames[] = ['Summer', 'Autumn', 'Fall'];

export const SemesterCodes: TSemesterCodes[] = ['01', '02', '03'];

export const academicSemesterNameCodeMapper: TAcademicSemesterNameCodeMapper = {
  Autumn: '01',
  Summer: '02',
  Fall: '03',
};
