import * as SQLite from 'expo-sqlite';
import logger from '../logging/logger';

export const createActivity = async (db: SQLite.SQLiteDatabase, activity: Activity) => {
    const createQuery = `
        INSERT INTO Activities (date, startTime, endTime, ActivityTypeId)
        VALUES (?, ?, ?, ?)
    `

    const values = [
        activity.date, //YYYY-MM-DD
        activity.startTime, //HH:MM:SS
        activity.endTime,
        activity.activityTypeId
    ]

    try {
        const results: SQLite.SQLResultSet | null = await new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(createQuery, values, (_, resultSet) => resolve(resultSet), (_, error) => {reject(error); return false;});
            })
        })
    } catch (err) {
        logger.error("Failed to create account Activity: " + err);
    }
}

export const getAllActivities = async (db: SQLite.SQLiteDatabase) => {
    try {
        const activities: Activity[] = [];
        const results: SQLite.SQLResultSet | null = await new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql('SELECT * FROM Activities', [], (_, resultSet) => resolve(resultSet), (_, error) => {reject(error); return false;});
            })
        })
        if (results) {
            for (let i = 0; i < results.rows.length; i++) {
                activities.push(results.rows.item(i) as Activity);
            }
        }
        return activities;
    } catch (err) {
        logger.error("Failed to get all activities: " + err);
    }
}

export const getActivityCascadeById = async (db: SQLite.SQLiteDatabase, activityId: number) => {
    const getActivityQuery = `
        SELECT * FROM Activities WHERE activityId = ?
    `

    const activityValues = [activityId];
    let activityInfo;

    try {
        const getActivityResults: SQLite.SQLResultSet | null = await new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(getActivityQuery, activityValues, (_, resultSet) => resolve(resultSet), (_, error) => {reject(error); return false;});
            })
        })
        if (!getActivityResults) {
            logger.error("Activity with id '" + activityId + " not found");
            throw new Error("Activity with id '" + activityId + " not found");
        }
        activityInfo = getActivityResults.rows.item(0) as Activity;
    } catch (err) {
        logger.error("Failed to get Activity with id '" + activityId + ": " + err);
        throw new Error("Failed to get Activity with id '" + activityId + ": " + err);
    }

    const getExercisesQuery = `
        SELECT * FROM ExerciseSessions WHERE activityId = ?
    `

    const exercisesValues = [activityId];

    const exerciseSessions: ExerciseSession[] = [];

    try {
        const getExercisesResults: SQLite.SQLResultSet | null = await new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(getExercisesQuery, exercisesValues, (_, resultSet) => resolve(resultSet), (_, error) => {reject(error); return false;});
            })
        })
        if (getExercisesResults) {
            for (let i = 0; i < getExercisesResults.rows.length; i++) {
                exerciseSessions.push(getExercisesResults.rows.item(i) as ExerciseSession);
            }
        }
    } catch (err) {
        logger.error("Failed to get exercise session: " + err);
        throw new Error("Failed to get exercise session: " + err);
    }

    try {
        const allExerciseSessionsInfo = [];
        for (let i = 0; i < exerciseSessions.length; i++) {
            const exerciseSessionId = exerciseSessions[i].id;

            const getExerciseSetsQuery = `
                SELECT * FROM ExerciseSets WHERE exerciseSessionId = ?
            `

            const getExerciseSetsValues = [exerciseSessionId];

            const exerciseSets: ExerciseSet[] = [];

            try {
                const getExerciseSets: SQLite.SQLResultSet | null = await new Promise((resolve, reject) => {
                    db.transaction((tx) => {
                        tx.executeSql(getExerciseSetsQuery, getExerciseSetsValues, (_, resultSet) => resolve(resultSet), (_, error) => {reject(error); return false;});
                    })
                })
                if (getExerciseSets) {
                    for (let j = 0; j < getExerciseSets.rows.length; j++) {
                        exerciseSets.push(getExerciseSets.rows.item(j) as ExerciseSet);
                    }
                }
            } catch (err) {
                logger.error("Error getting exercise sets: " + err);
                throw new Error("Error getting exercise sets: " + err);
            }

            const exerciseSessionCascade = {
                "exerciseSessionInfo": exerciseSessions[i],
                "exerciseSessionSets": exerciseSets,
            }
            allExerciseSessionsInfo.push(exerciseSessionCascade);
        }

        const activityCascadeInfo = {
            "activityInfo": activityInfo,
            "sessionsInfo": allExerciseSessionsInfo,
        };

        return activityCascadeInfo;
    } catch (err) {
        logger.error("Error getting all activity information: " + err);
        throw new Error("Error getting all activity information: " + err);
    }
}