import { ITalentIncubator } from "../models/ITalentIncubator";
import { Talent } from "../models/Talent";
import { TalentSession } from "../models/TalentSession";

export class MockTalentIncubator implements ITalentIncubator {
    incubate(talent: Talent, session: TalentSession): void {
        throw new Error("Method not implemented.");
    }
    poll(): { talent: Talent; session: TalentSession; } {
        throw new Error("Method not implemented.");
    }
    stop(): void {
        throw new Error("Method not implemented.");
    }
    getTalent(): Talent {
        throw new Error("Method not implemented.");
    }
    isIncubating(): boolean {
        throw new Error("Method not implemented.");
    }
}