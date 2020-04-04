type TalentSession = {
    id: number,
    userId: number,
    talentId: number,
    startTimestamp: Date,
    endTimestamp: Date,
    progressObtained: number
}

export default TalentSession;