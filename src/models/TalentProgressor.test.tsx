import { createTalent, Talent } from "./Talent";
import TalentSession from "./TalentSession";
import LocalTalentSessionModel from "./LocalTalentSessionModel";
import { TalentProgressor } from "./TalentProgressor";

// Unit Tests

it("progresses a talent", () => {
    let progressor = new TalentProgressor();
    let sessionModel = new LocalTalentSessionModel();

    let testTalent: Talent = createTalent(1, "My Talent", 7, 0, 40);
    let testSession: TalentSession = sessionModel.exchange(testTalent);

    progressor.incubate(testTalent, testSession);

    let timeJumpS = 1;

    // Jump time ahead by 1 second
    jest.spyOn(Date, "now")
        .mockImplementationOnce(() => Date.now() + timeJumpS * 1000);

    let { talent, session } = progressor.poll();

    let expTotalProgressSeconds = talent.progressTarget * 60 * 60;
    let expProgressRate = 1 / expTotalProgressSeconds;
    let expProgress = expProgressRate * timeJumpS;

    expect(talent.progress).toBeCloseTo(expProgress, 7);
    expect(talent.totalSeconds).toBeCloseTo(1);
    expect(session.progressObtained).toBeCloseTo(expProgress, 7);
});