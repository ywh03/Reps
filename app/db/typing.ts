type Activity = {
    id: number,
    date: string,
    startTime: string,
    endTime: string,
    activityTypeId: number,
}

type ActivityType = {
    name: string,
    logo: string,
}

type ExerciseType = {
    name: string,
    unit: string,
    pr: number,
}

type ExerciseSession = {
    id: number,
    exerciseTypeId: number,
    activityId: number,
}

type ExerciseSet = {
    id: number,
    exerciseSessionId: number,
    reps: number,
    failedLastRep: boolean,
    remarks: string,
}