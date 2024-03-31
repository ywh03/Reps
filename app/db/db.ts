import * as SQLite from 'expo-sqlite';
import logger from '../logging/logger';

export const createTables = async(db: SQLite.SQLiteDatabase) => {
    const activityTypeQuery = `
        CREATE TABLE IF NOT EXISTS ActivityTypes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            logo TEXT,
        )
    `
    
    const activitiesQuery = `
        CREATE TABLE IF NOT EXISTS Activities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date DATE,
            startTime TIME,
            endTime TIME,
            activityTypeId INTEGER,
            FOREIGN KEY (activityTypeId) REFERENCES ActivityType(id)
        )
    `

    const exerciseTypeQuery = `
        CREATE TABLE IF NOT EXISTS ExerciseTypes (
            name TEXT PRIMARY KEY,
            unit TEXT,
            pr FLOAT
        )
    `

    const exerciseSessionQuery = `
        CREATE TABLE IF NOT EXISTS ExerciseSessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            exerciseTypeName TEXT,
            FOREIGN KEY (exerciseTypeName) REFERENCES ExerciseType(name)
            activityId INTEGER,
            FOREIGN KEY (activityId) REFERENCES Activity(id) ON DELETE CASCADE
        )
    `

    const exerciseSetQuery = `
        CREATE TABLE IF NOT EXISTS ExerciseSets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            exerciseSessionId INTEGER,
            FOREIGN KEY (exerciseSessionId) REFERENCES ExerciseSession(id) ON DELETE CASCADE
            reps INTEGER,
            failedLastRep BOOLEAN,
            remarks TEXT,
        }
    `

    try {
        db.transaction((tx) => {
            tx.executeSql(activityTypeQuery),
            tx.executeSql(activitiesQuery),
            tx.executeSql(exerciseTypeQuery),
            tx.executeSql(exerciseSessionQuery),
            tx.executeSql(exerciseSetQuery)
        }, (err) => {
            logger.error("Error: " + err);
        }, () => {
            logger.log('info', 'Tables successfully created');
        })
    } catch (err) {
        logger.error('Error: ' + err);
        logger.error("Failed to create tables")
    }
}