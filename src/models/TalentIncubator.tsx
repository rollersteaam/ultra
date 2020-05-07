import { Talent, cloneTalent } from "./Talent";
import { TalentSession, cloneSession } from "./TalentSession";
import { ITalentIncubator } from './ITalentIncubator';
import ReactGA from 'react-ga';

export class TalentIncubator implements ITalentIncubator {
    private initialTalent: Talent | null = null;
    private talent: Talent | null = null;
    private session: TalentSession | null = null;
    private lastUpdateMs?: number;
    
    incubate(talent: Talent, session: TalentSession) {
        this.initialTalent = cloneTalent(talent);
        this.talent = cloneTalent(talent);
        this.session = cloneSession(session);
        this.lastUpdateMs = Date.now();
    }

    poll(): {talent: Talent, session: TalentSession} {
        if (this.talent === null ||
            this.session === null ||
            this.initialTalent === null)
            throw new EvalError("Cannot poll. No talents are being incubated.");

        if (this.talent.progressTarget <= 0)
            throw new EvalError("Could not incubate talent. Progress target was 0, causing divide by zero. Set a progress target of N hours on the talent object.");

        if (this.lastUpdateMs === undefined)
            throw new EvalError("Could not incubate talent. Illegal program state. Last Update MS was not initialised to a millis, which is impossible, and implies incubate() was never called.");

        let nowMs = Date.now();
        let msDelta = nowMs - this.lastUpdateMs;
        let sDelta = msDelta / 1000;
        this.lastUpdateMs = nowMs;

        let progress = sDelta;

        this.session.endTimestamp = new Date();
        this.session.progressObtained += progress;
        if (!this.talent.streakObtained && this.session.progressObtained >= 1800) {
            progress += this.talent.progressTarget / 7;

            this.talent.streakCount++;
            this.talent.streakObtained = true;
            this.talent.expiring = false;
            this.talent.burndown = false;

            ReactGA.event({
                category: 'User',
                action: 'Streak Hit'
            });
        }

        this.talent.progress += progress;
        if (this.talent.progress >= this.talent.progressTarget) {
            let nOverflow = Math.floor(this.talent.progress / this.talent.progressTarget);
            this.talent.goldUltras += nOverflow;
            this.talent.progress = this.talent.progress % this.talent.progressTarget;
        }

        this.talent.totalSeconds += sDelta;
        this.session.ultrasHeld = this.talent.goldUltras;
        this.session.progressHeld = this.talent.progress;

        return {
            talent: cloneTalent(this.talent),
            session: cloneSession(this.session)
        }
    }

    stop() {
        this.initialTalent = null;
        this.talent = null;
        this.session = null;
        this.lastUpdateMs = undefined;
    }

    isIncubating(): boolean {
        return this.talent !== null;
    }

    getTalent() : Talent | null {
        return this.talent;
    }
}