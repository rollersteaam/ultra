import { Talent, cloneTalent } from "./Talent";
import TalentSession, { cloneSession } from "./TalentSession";

export class TalentProgressor {
    private initialTalent: Talent;
    private talent: Talent;
    private session: TalentSession;

    incubate(talent: Talent, session: TalentSession) {
        this.initialTalent = cloneTalent(talent);
        this.talent = cloneTalent(talent);
        this.session = cloneSession(session);
    }

    poll(): {talent: Talent, session: TalentSession} {
        const totalProgressSeconds = this.talent.progressTarget * 60 * 60;
        const progressRate = 1 / totalProgressSeconds;

        let nowMs = Date.now();
        let msDelta = nowMs - this.session.startTimestamp.getTime();
        let sDelta = msDelta / 1000;

        let progress = progressRate * sDelta;

        this.session.progressObtained = progress;

        this.talent.progress = this.initialTalent.progress + progress;
        this.talent.totalSeconds = this.initialTalent.totalSeconds + sDelta;

        return {
            talent: cloneTalent(this.talent),
            session: cloneSession(this.session)
        }
    }
}