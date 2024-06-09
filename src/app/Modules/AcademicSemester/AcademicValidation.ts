import { z } from 'zod';
import { Months, SemesterCodes, SemesterNames } from './AcademicConst';

const TMonthsSchema = z.enum([...Months] as [string, ...string[]]);

export const CreateAcademicSemesterValidationSchema = z.object({
  body: z.object({
    name: z.enum([...SemesterNames] as [string, ...string[]]),
    code: z.enum([...SemesterCodes] as [string, ...string[]]),
    year: z.string(),
    startMonth: TMonthsSchema,
    endMonth: TMonthsSchema,
  }),
});

export const UpdateAcademicSemesterValidationSchema = z.object({
  body: z.object({
    name: z.enum([...SemesterNames] as [string, ...string[]]).optional(),
    code: z.enum([...SemesterCodes] as [string, ...string[]]).optional(),
    year: z.string().optional(),
    startMonth: TMonthsSchema.optional(),
    endMonth: TMonthsSchema.optional(),
  }),
});
