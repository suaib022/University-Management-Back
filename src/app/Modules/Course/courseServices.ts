
import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import { CourseSearchableFields } from "./courseConstants";
import { TCourse } from "./courseInterface";
import { Course } from "./courseModel";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const createCourseIntoDB = async (payload: TCourse) => {
    const result = await Course.create(payload);
    return result;
}

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
    const courseQuery = new QueryBuilder(Course.find(), query).search(CourseSearchableFields).filter().sort().paginate().fields();

    const result = await courseQuery.modelQuery;
    return result;
};

const getSingleCourseFromDB = async (id: string) => {
    const result = await Course.findById(id).populate(
        'preRequisiteCourses.course',
    );
    return result;
};

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
    const { preRequisiteCourses, ...remainingCourseData } = payload;

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        // step 1: basic course info update
        const updateBasicCourseInfo = await Course.findByIdAndUpdate(id, remainingCourseData, { new: true, runValidators: true });

        if (!updateBasicCourseInfo) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed To Update Course!');
        }

        // check if there exists any preRequisite Course
        if (preRequisiteCourses && preRequisiteCourses.length > 0) {
            const deletedPreRequisites = preRequisiteCourses.filter((elem) => elem.course && elem.isDeleted).map((elem) => elem.course);

            const deletedPreRequisiteCourses = await Course.findByIdAndUpdate(id, { $pull: { preRequisiteCourses: { course: { $in: deletedPreRequisites } } } },
                {
                    new: true, runValidators: true
                }
            );

            if (!deletedPreRequisiteCourses) {
                throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course!');
            }

            const newPreRequisites = preRequisiteCourses?.filter((elem) => elem.course && !elem.isDeleted);

            const newPreRequisiteCourses = await Course.findByIdAndUpdate(id, { $addToSet: { preRequisiteCourses: { $each: newPreRequisites } } },
                { new: true, runValidators: true }
            );

            if (!newPreRequisiteCourses) {
                throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course!');
            }
        }

        const result = await Course.findById(id).populate('preRequisiteCourses.course');
        return result;
    }

    catch (err) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed To Update Course')
    }
}

const deleteCourseFromDB = async (id: string) => {
    const result = await Course.findByIdAndUpdate(
        id,
        { isDeleted: true },
        {
            new: true,
        },
    );
    return result;
};

export const CourseServices = {
    createCourseIntoDB, getAllCoursesFromDB, getSingleCourseFromDB, updateCourseIntoDB, deleteCourseFromDB
}