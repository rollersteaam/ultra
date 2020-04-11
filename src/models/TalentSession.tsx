export type TalentSession = {
    id: number,
    userId: number,
    talentId: number,
    startTimestamp: Date,
    endTimestamp: Date | null,
    progressObtained: number,
    ultrasHeld: number
}

export const createSession = (id: number, talentId: number, userId: number = 0, startTimestamp: Date = new Date(), endTimestamp: Date | null = null, progressObtained: number = 0, ultrasHeld: number = 0): TalentSession => ({
    id: id,
    talentId: talentId,
    userId: userId,
    startTimestamp: startTimestamp,
    endTimestamp: endTimestamp,
    progressObtained: progressObtained,
    ultrasHeld: ultrasHeld
});

export const cloneSession = (session: TalentSession): TalentSession => ({
    id: session.id,
    talentId: session.talentId,
    userId: session.userId,
    startTimestamp: session.startTimestamp,
    endTimestamp: session.endTimestamp,
    progressObtained: session.progressObtained,
    ultrasHeld: session.ultrasHeld
});