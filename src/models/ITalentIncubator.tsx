import { Talent } from "./Talent";
import { TalentSession } from "./TalentSession";

export interface ITalentIncubator {
    incubate(talent: Talent, session: TalentSession): void
    poll(): {talent: Talent, session: TalentSession} | null
    stop(): void
    isIncubating(): boolean
}