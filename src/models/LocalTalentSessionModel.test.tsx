import LocalTalentSessionModel from "./LocalTalentSessionModel"
import { createSession } from "./TalentSession";
import { Talent, createTalent } from './Talent';
import { advanceTo } from 'jest-date-mock';

// Unit Tests

// TODO: Fix test, this is broken due to persistence, we should figure out a
//  strategy for swapping stored data.
//      swapping during tests.
// it("creates a talent session", () => {
//     let model = new LocalTalentSessionModel();
//     let session = createSession(2, 3, 7);
//     let modelSession = model.create(session);

//     expect(modelSession).not.toBe(session);
//     expect(modelSession.id).not.toBe(session.id);
//     expect(modelSession.id).toBe(0);
//     expect(modelSession.talentId).toBe(session.talentId);
//     expect(modelSession.userId).toBe(session.userId);
// })

// Integration Tests

it("creates a talent session for a talent", () => {
    advanceTo(new Date());

    let talent = createTalent(5, "Harry Pottering", 2);
    let model = new LocalTalentSessionModel();

    let modelSession = model.exchange(talent);

    expect(modelSession.talentId).toBe(talent.id);
    expect(modelSession.id).toBe(0);
    expect(modelSession.userId).toBe(talent.userId);
    expect(modelSession.startTimestamp).toStrictEqual(new Date());
    expect(modelSession.endTimestamp).toBeNull();
    expect(modelSession.progressObtained).toBe(0);
});