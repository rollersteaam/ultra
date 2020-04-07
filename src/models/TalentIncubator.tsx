import { Talent, cloneTalent } from "./Talent";
import { TalentSession, cloneSession } from "./TalentSession";
import { ITalentIncubator } from './ITalentIncubator';

export class TalentIncubator implements ITalentIncubator {
    private initialTalent: Talent | null = null;
    private talent: Talent | null = null;
    private session: TalentSession | null = null;

    incubate(talent: Talent, session: TalentSession) {
        this.initialTalent = cloneTalent(talent);
        this.talent = cloneTalent(talent);
        this.session = cloneSession(session);
    }

    poll(): {talent: Talent, session: TalentSession} {
        if (this.talent === null ||
            this.session === null ||
            this.initialTalent === null)
            throw new EvalError("Cannot poll. No talents are being incubated.");

        const totalProgressSeconds = this.talent.progressTarget * 60 * 60;

        if (totalProgressSeconds <= 0)
            throw new EvalError("Could not incubate talent. Progress target was 0, causing divide by zero. Set a progress target of N hours on the talent object.");

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

    stop() {
        this.initialTalent = null;
        this.talent = null;
        this.session = null;
    }

    isIncubating(): boolean {
        return this.talent !== null;
    }

    getTalent() : Talent | null {
        return this.talent;
    }
}