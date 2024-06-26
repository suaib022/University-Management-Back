import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { RegistrationStatus } from "./semesterRegistration.constant";
import { TSemesterRegistration } from "./semesterRegistration.interface";
import { SemesterRegistration } from "./semesterRegistration.model";
import { AcademicSemester } from "../AcademicSemester/AcademicModel";
import QueryBuilder from "../../builder/QueryBuilder";
import mongoose from "mongoose";

const createSemesterRegistrationIntoDB = async (payload: TSemesterRegistration) => {
    /***
     *1. check existing registered semesters status
     *2. check existence of semester
     *3. check if the semester is already registered
     *4. create semester registration
     */


    //step 1
    const isThereAnyUpcomingOrOngoingSemester = await SemesterRegistration.findOne({
        $or: [
            { status: RegistrationStatus.UPCOMING },
            { status: RegistrationStatus.ONGOING },
        ]
    });

    if (isThereAnyUpcomingOrOngoingSemester) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `There is already an ${isThereAnyUpcomingOrOngoingSemester.status} registered semester !`,
        );
    }


    // step 2
    const academicSemester = payload?.academicSemester;
    const doesAcademicSemesterExist = await AcademicSemester.findById(academicSemester);

    if (!doesAcademicSemesterExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'Requested Academic Semester Not Found !')
    };


    //step 3
    const doesSemesterRegistrationExist = await SemesterRegistration.findOne({ academicSemester });

    if (doesSemesterRegistrationExist) {
        throw new AppError(
            httpStatus.CONFLICT,
            'This semester is already registered!',
        );
    };

    // step-4
    const result = await SemesterRegistration.create(payload);
    return result;
};

const getAllSemesterRegistrationsFromDB = async (query: Record<string, unknown>) => {
    const semesterRegistrationQuery = new QueryBuilder(SemesterRegistration.find().populate('academicSemester'), query).filter().sort().paginate().fields();

    const result = await semesterRegistrationQuery.modelQuery;
    return result;
};

const getSingleSemesterRegistrationsFromDB = async (id: string) => {
    const result = await SemesterRegistration.findById(id).populate('academicSemester');

    return result;
};

const updateRegisteredSemesterInDB = async (id: string, payload: Partial<TSemesterRegistration>) => {
    /***
     * 1. check if the semester exists
     * 2. check if the requested registered semester exist
     * 3. update according to the status of registered semester : 
        * a. UPCOMING : can update everything
        * b. ENDED : can't update anything
        * c. ONGOING : can updated status to ENDED only
     * 
     * UPCOMING --> ONGOING --> ENDED
     *
     */



    // step - 1 & 2
    const doesSemesterRegistrationExist = await SemesterRegistration.findById(id);

    if (!doesSemesterRegistrationExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'Requested Semester is not registered')
    };

    // step - 3
    const currentRegisteredSemesterStatus = doesSemesterRegistrationExist?.status;
    const requestedStatus = payload?.status;

    if (currentRegisteredSemesterStatus === RegistrationStatus.ENDED) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `This semester is already ${currentRegisteredSemesterStatus}`,
        );
    };

    if (currentRegisteredSemesterStatus === RegistrationStatus.UPCOMING && requestedStatus === RegistrationStatus.ENDED) {
        {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                `You can not directly change status from ${currentRegisteredSemesterStatus} to ${requestedStatus}`,
            );
        }
    }

    if (currentRegisteredSemesterStatus === RegistrationStatus.ONGOING && requestedStatus === RegistrationStatus.UPCOMING) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `You can not directly change status from ${currentRegisteredSemesterStatus} to ${requestedStatus}`,
        );
    };

    const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
        new: true, runValidators: true
    });
    return result;
};;

const deleteRegisteredSemesterFromDB = async (id: string) => {
    /**
     *  1. check the requested data exists in DB 
     *  2. delete associated offered course
     *  3. delete semester registration when the status is 'UPCOMING
    */

    const doesSemesterRegistrationExist = await SemesterRegistration.findById(id);

    if (!doesSemesterRegistrationExist) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'This registered semester is not found !',
        );
    }

    // checking if the status is still "UPCOMING"
    const semesterRegistrationStatus = doesSemesterRegistrationExist.status;

    if (semesterRegistrationStatus !== 'UPCOMING') {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `You can not update as the registered semester is ${semesterRegistrationStatus}`,
        );
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const deletedOfferedCourse = true;

        if (!deletedOfferedCourse) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Failed to delete semester registration !',
            );
        }

        const deletedSemesterRegistration = await SemesterRegistration.findByIdAndDelete(id, { session, new: true });

        if (!deletedSemesterRegistration) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Failed to delete semester registration !',
            );
        }

        await session.commitTransaction();
        await session.endSession();

        return null;
    } catch (err: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error(err);
    }
}

export const SemesterRegistrationServices = {
    createSemesterRegistrationIntoDB, getAllSemesterRegistrationsFromDB, getSingleSemesterRegistrationsFromDB, updateRegisteredSemesterInDB, deleteRegisteredSemesterFromDB
}