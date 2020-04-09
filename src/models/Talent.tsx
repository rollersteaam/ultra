export type Talent = {
    // TODO: Split into two different data objects?

    // Talent (TalentInfo)
    id: number
    userId: number
    name: string

    // TalentProgression
    progress: number
    progressTarget: number
    whiteStars: number
    totalSeconds: number
    streakCount: number
    streakObtained: boolean
    expiring: boolean
}

export function createTalent(id: number, name: string, userId: number = 0, progress: number = 0, progressTarget: number = (1/15), whiteStars: number = 0, totalSeconds: number = 0, streakCount: number = 0, streakObtained: boolean = false, expiring: boolean = false): Talent {
    return {
        id: id,
        userId: userId,
        name: name,
        progress: progress,
        progressTarget: progressTarget,
        whiteStars: whiteStars,
        totalSeconds: totalSeconds,
        streakCount: streakCount,
        streakObtained: streakObtained,
        expiring: false
    }
}

export function cloneTalent(talent: Talent): Talent {
    return {
        id: talent.id,
        userId: talent.userId,
        name: talent.name,
        progress: talent.progress,
        progressTarget: talent.progressTarget,
        whiteStars: talent.whiteStars,
        totalSeconds: talent.totalSeconds,
        streakCount: talent.streakCount,
        streakObtained: talent.streakObtained,
        expiring: talent.expiring
    }
}