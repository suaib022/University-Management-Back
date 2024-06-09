export type TMonths =
  | 'January'
  | 'February'
  | 'March'
  | 'April'
  | 'May'
  | 'June'
  | 'July'
  | 'August'
  | 'September'
  | 'October'
  | 'November'
  | 'December';

export type TSemesterNames = 'Autumn' | 'Summer' | 'Fall';
export type TSemesterCodes = '01' | '02' | '03';

export type TAcademicSemester = {
  name: TSemesterNames;
  code: TSemesterCodes;
  year: string;
  startMonth: TMonths;
  endMonth: TMonths;
};

export type TAcademicSemesterNameCodeMapper = {
  [key: string]: string;
};
