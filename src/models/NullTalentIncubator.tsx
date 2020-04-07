import { ITalentIncubator } from "./ITalentIncubator";
import { Talent } from '../models/Talent';
import { TalentSession } from '../models/TalentSession';

export class NullTalentIncubator implements ITalentIncubator {
    static Null = new NullTalentIncubator();

    incubate(talent: Talent, session: TalentSession): void {}

    poll(): { talent: Talent; session: TalentSession; } | null {
        return null;
    }

    stop(): void {}

    isIncubating(): boolean {
        return false;
    }

    getTalent(): Talent | null {
        return null;
    }
}