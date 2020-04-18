import { newTalent, deleteTalent, getTalents, configureModel, updateTalent, excludeTalent, includeTalent, calculateTalentProgression }  from './talentActions';
import { NEW_TALENT, DELETE_TALENT, GET_TALENTS, UPDATE_TALENT, EXCLUDE_TALENT, INCLUDE_TALENT, CALCULATE_PROGRESSION } from './types';
import jokeDispatch from '../testutils/jokeDispatch';
import { createTalent, Talent, cloneTalent } from '../models/Talent';
import IModel from '../models/IModel';
import LocalTalentModel from '../models/LocalTalentModel';
import { createSession, TalentSession } from '../models/TalentSession';
import { RootState } from '../store';
import { advanceTo } from 'jest-date-mock';

let testTalents: Talent[];
let model: IModel<Talent>;

class MockTalentModel implements IModel<Talent> {
    create(element: Talent): Talent {
        throw new Error("Method not implemented.");
    }
    getAll(): Talent[] {
        throw new Error("Method not implemented.");
    }
    get(id: number): Talent {
        throw new Error("Method not implemented.");
    }
    update(element: Talent): Talent {
        throw new Error("Method not implemented.");
    }
    delete(element: Talent): void {
        throw new Error("Method not implemented.");
    }
    deleteId(id: number): void {
        throw new Error("Method not implemented.");
    }
}

// Unit Tests

it("dispatches exclude request correctly", () => {
    let dis = jokeDispatch(excludeTalent(1));
    expect(dis).toBeCalledWith({
        type: EXCLUDE_TALENT,
        payload: 1
    })
})

it("dispatches include request correctly", () => {
    let testTalent = createTalent(1, "Hooray", 7);
    class TestTalentModel extends MockTalentModel {
        get(id: number): Talent {
            if (id === 1) {
                return testTalent;
            }

            throw new Error("Unexpected get call received.");
        }
    }
    configureModel(new TestTalentModel());

    let dis = jokeDispatch(includeTalent(1));
    expect(dis).toBeCalledWith({
        type: INCLUDE_TALENT,
        payload: testTalent
    });
})

// Progression Tests
// 
// To see key information regarding terminology or rules of the progression
// system, seek the wiki for answers.

it("flags talent as streak obtained when a hit starts just after beginning of waking day", () => {
    advanceTo(new Date(2020, 3, 21, 8, 0, 0));

    let testTalents = [
        createTalent(0, "Programming", 7, 0, 40, 0, 0, 0, false, false)
    ]
    expect(testTalents[0].streakObtained).toBeFalsy();

    let today = new Date();

    let yesterdayEnd = new Date(today);
    yesterdayEnd.setHours(4, 30, 0, 0);

    let yesterdayStart = new Date(yesterdayEnd);
    yesterdayStart.setHours(4, 0, 0, 0);

    let testSessions = [
        createSession(0, 0, 7, yesterdayStart, yesterdayEnd)
    ]
    let expectedTalent = cloneTalent(testTalents[0]);
    expectedTalent.streakObtained = true;
    expect(expectedTalent).not.toEqual(testTalents[0]);
    expect(expectedTalent).not.toStrictEqual(testTalents[0]);
    let expectedTalents = [
        expectedTalent
    ]

    let state: () => RootState = () => ({
        talents: {
            items: testTalents,
            lastBeginsEditing: false
        },
        timer: {
            session: {
                talent: null,
                session: null
            },
            sessions: testSessions
        }
    })

    expect(jokeDispatch(calculateTalentProgression(), state)).toBeCalledWith({
        type: CALCULATE_PROGRESSION,
        payload: {
            talents: expectedTalents,
            sessions: testSessions
        }
    })
});

it("flags talent as streak obtained when a hit starts and ends just before the end of a waking day", () => {
    advanceTo(new Date(2020, 3, 21, 3, 59, 59, 999));

    let testTalents = [
        createTalent(0, "Programming", 7, 0, 40, 0, 0, 0, false, false)
    ]
    expect(testTalents[0].streakObtained).toBeFalsy();

    let today = new Date();

    let yesterdayEnd = new Date(today);
    yesterdayEnd.setHours(3, 59, 59, 999);

    let yesterdayStart = new Date(yesterdayEnd);
    yesterdayStart.setHours(3, 29, 59, 999);

    let testSessions = [
        createSession(0, 0, 7, yesterdayStart, yesterdayEnd)
    ]
    let expectedTalent = cloneTalent(testTalents[0]);
    expectedTalent.streakObtained = true;
    expect(expectedTalent).not.toEqual(testTalents[0]);
    expect(expectedTalent).not.toStrictEqual(testTalents[0]);
    let expectedTalents = [
        expectedTalent
    ]

    let state: () => RootState = () => ({
        talents: {
            items: testTalents,
            lastBeginsEditing: false
        },
        timer: {
            session: {
                talent: null,
                session: null
            },
            sessions: testSessions
        }
    })

    expect(jokeDispatch(calculateTalentProgression(), state)).toBeCalledWith({
        type: CALCULATE_PROGRESSION,
        payload: {
            talents: expectedTalents,
            sessions: testSessions
        }
    })
})

function createSessionWithinWakingDay(id: number, startHoursComp: number[], sessionDuration: number[], date: Date = new Date()): TalentSession {
    let yesterdayStart = new Date(date);
    yesterdayStart.setHours(startHoursComp[0], ...startHoursComp.slice(1));

    // Add duration offsets to start hours to get end times
    for (let i = 0; i < startHoursComp.length && i < sessionDuration.length; i++) {
        sessionDuration[i] = startHoursComp[i] + sessionDuration[i]
    }

    let yesterdayEnd = new Date(yesterdayStart);
    yesterdayEnd.setHours(sessionDuration[0], ...sessionDuration.slice(1));

    return createSession(id, 0, 7, yesterdayStart, yesterdayEnd);
}

it("flags talent as streak not obtained when there are several sessions which are not hits within the waking day", () => {
    advanceTo(new Date(2020, 3, 21, 8, 0, 0, 0));

    let testTalents = [
        createTalent(0, "Programming", 7, 0, 40, 0, 0, 0, true, false)
    ]
    expect(testTalents[0].streakObtained).toBeTruthy();

    let s1 = createSessionWithinWakingDay(0, [5], [0, 20]);
    let s2 = createSessionWithinWakingDay(1, [6], [0, 29, 59, 999]);

    let testSessions = [
        s1,
        s2
    ]
    let expectedTalent = cloneTalent(testTalents[0]);

    expectedTalent.streakObtained = false;

    expect(expectedTalent).not.toEqual(testTalents[0]);
    expect(expectedTalent).not.toStrictEqual(testTalents[0]);
    let expectedTalents = [
        expectedTalent
    ]

    let state: () => RootState = () => ({
        talents: {
            items: testTalents,
            lastBeginsEditing: false
        },
        timer: {
            session: {
                talent: null,
                session: null
            },
            sessions: testSessions
        }
    })

    expect(jokeDispatch(calculateTalentProgression(), state)).toBeCalledWith({
        type: CALCULATE_PROGRESSION,
        payload: {
            talents: expectedTalents,
            sessions: testSessions
        }
    })
});

it("flags talent as streak not obtained when there are no sessions within the waking day", () => {
    advanceTo(new Date(2020, 3, 21, 8, 0, 0, 0));

    let testTalents = [
        createTalent(0, "Programming", 7, 0, 40, 0, 0, 0, true, false)
    ]
    expect(testTalents[0].streakObtained).toBeTruthy();

    let today = new Date();
    let s1 = createSessionWithinWakingDay(0, [3], [0, 20], today);
    let s2 = createSessionWithinWakingDay(1, [2, 29, 59, 999], [0, 30], today);

    let testSessions = [
        s1,
        s2
    ]
    let expectedTalent = cloneTalent(testTalents[0]);

    expectedTalent.streakObtained = false;

    expect(expectedTalent).not.toEqual(testTalents[0]);
    expect(expectedTalent).not.toStrictEqual(testTalents[0]);
    let expectedTalents = [
        expectedTalent
    ]

    let state: () => RootState = () => ({
        talents: {
            items: testTalents,
            lastBeginsEditing: false
        },
        timer: {
            session: {
                talent: null,
                session: null
            },
            sessions: testSessions
        }
    })

    expect(jokeDispatch(calculateTalentProgression(), state)).toBeCalledWith({
        type: CALCULATE_PROGRESSION,
        payload: {
            talents: expectedTalents,
            sessions: testSessions
        }
    })
})

it("flags talent as streak not obtained when hit starts just before the beginning of the waking day and ends after the beginning of the waking day", () => {
    advanceTo(new Date(2020, 3, 21, 5, 0, 0, 0));

    let testTalents = [
        createTalent(0, "Programming", 7, 0, 40, 0, 0, 0, true, false)
    ]
    expect(testTalents[0].streakObtained).toBeTruthy();

    let today = new Date();

    let yesterdayEnd = new Date(today);
    yesterdayEnd.setHours(4, 0, 0, 0);

    let yesterdayStart = new Date(yesterdayEnd);
    yesterdayStart.setTime(yesterdayEnd.getTime() - (30*60*1000));

    let testSessions = [
        createSession(0, 0, 7, yesterdayStart, yesterdayEnd)
    ]
    let expectedTalent = cloneTalent(testTalents[0]);

    expectedTalent.streakObtained = false;

    expect(expectedTalent).not.toEqual(testTalents[0]);
    expect(expectedTalent).not.toStrictEqual(testTalents[0]);
    let expectedTalents = [
        expectedTalent
    ]

    let state: () => RootState = () => ({
        talents: {
            items: testTalents,
            lastBeginsEditing: false
        },
        timer: {
            session: {
                talent: null,
                session: null
            },
            sessions: testSessions
        }
    })

    expect(jokeDispatch(calculateTalentProgression(), state)).toBeCalledWith({
        type: CALCULATE_PROGRESSION,
        payload: {
            talents: expectedTalents,
            sessions: testSessions
        }
    })
});

it("flags a talent as not expiring when latest streak hit ended just after the beginning of last waking day (so no streak hits have been missed)", () => {
    advanceTo(new Date(2020, 3, 21, 8, 0, 0));

    let testTalents = [
        createTalent(0, "Programming", 7, 0, 40, 0, 0, 0, false, true)
    ]
    expect(testTalents[0].expiring).toBeTruthy();
    expect(testTalents[0].streakObtained).toBeFalsy();

    let today = new Date();

    let yesterdayEnd = new Date(today);
    // Go back 1 day
    yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);
    yesterdayEnd.setHours(4, 0, 0, 0);

    let yesterdayStart = new Date(yesterdayEnd);
    yesterdayStart.setTime(yesterdayEnd.getTime() - (30*60*1000));

    // Add an oddball session that wasn't a streak hit to today's waking day,
    // but came earlier than the last streak hit
    let oddballSession = createSessionWithinWakingDay(1, [6], [0, 29, 59, 999], new Date());

    let testSessions = [
        createSession(0, 0, 7, yesterdayStart, yesterdayEnd),
        oddballSession
    ]
    let expectedTalent = cloneTalent(testTalents[0]);
    expectedTalent.expiring = false;
    expect(expectedTalent).not.toEqual(testTalents[0]);
    expect(expectedTalent).not.toStrictEqual(testTalents[0]);
    let expectedTalents = [
        expectedTalent
    ]

    let state: () => RootState = () => ({
        talents: {
            items: testTalents,
            lastBeginsEditing: false
        },
        timer: {
            session: {
                talent: null,
                session: null
            },
            sessions: testSessions
        }
    })

    expect(jokeDispatch(calculateTalentProgression(), state)).toBeCalledWith({
        type: CALCULATE_PROGRESSION,
        payload: {
            talents: expectedTalents,
            sessions: testSessions
        }
    })
});

it("flags a talent as expiring when a talent has missed one streak hit (latest streak hit ended before the start of yesterday's waking day)", () => {
    advanceTo(new Date(2020, 3, 21, 6, 0, 0));

    let testTalents = [
        createTalent(0, "Programming", 7, 0, 40, 0, 0, 0, true, false)
    ]
    expect(testTalents[0].expiring).toBeFalsy();
    expect(testTalents[0].streakObtained).toBeTruthy();

    let today = new Date();

    let yesterdayEnd = new Date(today);
    yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);
    yesterdayEnd.setHours(3, 59, 59, 999);

    let yesterdayStart = new Date(yesterdayEnd);
    yesterdayStart.setTime(yesterdayEnd.getTime() - (30*60*1000));

    // Add an oddball session that wasn't a streak hit to today's waking day,
    // but came earlier than the last streak hit
    let oddballSession = createSessionWithinWakingDay(1, [6], [0, 29, 59, 999], new Date());

    let testSessions = [
        createSession(0, 0, 7, yesterdayStart, yesterdayEnd),
        oddballSession
    ]
    let expectedTalent = cloneTalent(testTalents[0]);
    expectedTalent.expiring = true;
    expectedTalent.streakObtained = false;
    expect(expectedTalent).not.toEqual(testTalents[0]);
    expect(expectedTalent).not.toStrictEqual(testTalents[0]);
    let expectedTalents = [
        expectedTalent
    ]

    let state: () => RootState = () => ({
        talents: {
            items: testTalents,
            lastBeginsEditing: false
        },
        timer: {
            session: {
                talent: null,
                session: null
            },
            sessions: testSessions
        }
    })

    expect(jokeDispatch(calculateTalentProgression(), state)).toBeCalledWith({
        type: CALCULATE_PROGRESSION,
        payload: {
            talents: expectedTalents,
            sessions: testSessions
        }
    })
});

it("doesn't reset a streak or remove any ultras when a hit ends just after expiration date", () => {
    advanceTo(new Date(2020, 3, 21, 8, 0, 0));

    let testTalents = [
        createTalent(0, "Programming", 7, 500, 4000, 2, 7000, 11, true, false, true)
    ]
    expect(testTalents[0].burndown).toBeTruthy();
    expect(testTalents[0].streakObtained).toBeTruthy();
    expect(testTalents[0].expiring).toBeFalsy();

    let today = new Date();
    let twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    let yesterdayEnd = twoDaysAgo;
    // TODO: Potentially implement an hour offset off expiration in the future?
    // Go backwards 4 hours
    // yesterdayEnd.setTime(yesterdayEnd.getTime() - (4*60*60*1000));

    let yesterdayStart = new Date(yesterdayEnd);
    yesterdayStart.setTime(yesterdayEnd.getTime() - (30*60*1000));

    let oddballSession = createSessionWithinWakingDay(1, [7, 30, 0, 1], [0, 30], twoDaysAgo);

    let testSessions = [
        createSession(0, 0, 7, yesterdayStart, yesterdayEnd),
        oddballSession
    ]

    let expectedTalent = cloneTalent(testTalents[0]);
    expectedTalent.expiring = true;
    expectedTalent.burndown = false;
    expectedTalent.streakObtained = false;

    expect(expectedTalent).not.toEqual(testTalents[0]);
    expect(expectedTalent).not.toStrictEqual(testTalents[0]);
    let expectedTalents = [
        expectedTalent
    ]

    let state: () => RootState = () => ({
        talents: {
            items: testTalents,
            lastBeginsEditing: false
        },
        timer: {
            session: {
                talent: null,
                session: null
            },
            sessions: testSessions
        }
    })

    expect(jokeDispatch(calculateTalentProgression(), state)).toBeCalledWith({
        type: CALCULATE_PROGRESSION,
        payload: {
            talents: expectedTalents,
            sessions: testSessions
        }
    })
});

it("resets a talent's streak and removes 1 ultra when past expiration", () => {
    advanceTo(new Date(2020, 3, 21, 8, 0, 0));

    let testTalents = [
        createTalent(0, "Programming", 7, 500, 4000, 2, 7000, 11, true, false, false)
    ]
    expect(testTalents[0].expiring).toBeFalsy();
    expect(testTalents[0].streakObtained).toBeTruthy();

    let today = new Date();
    let twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    let yesterdayEnd = twoDaysAgo;
    // TODO: Potentially implement an hour offset off expiration in the future?
    // Go backwards 4 hours
    // yesterdayEnd.setTime(yesterdayEnd.getTime() - (4*60*60*1000));

    let yesterdayStart = new Date(yesterdayEnd);
    yesterdayStart.setTime(yesterdayEnd.getTime() - (30*60*1000));

    let hitEndsOnExpiration = createSession(0, 0, 7, yesterdayStart, yesterdayEnd);
    hitEndsOnExpiration.ultrasHeld = 2;

    let oddballSession = createSessionWithinWakingDay(1, [10], [0, 29, 59, 999], twoDaysAgo);

    let testSessions = [
        hitEndsOnExpiration,
        oddballSession
    ]

    let expectedTalent = cloneTalent(testTalents[0]);
    expectedTalent.expiring = true;
    expectedTalent.streakObtained = false;
    expectedTalent.burndown = true;
    expectedTalent.goldUltras = 1;
    expectedTalent.progress = 0;
    expectedTalent.streakCount = 0;
    expectedTalent.streakObtained = false;

    expect(expectedTalent).not.toEqual(testTalents[0]);
    expect(expectedTalent).not.toStrictEqual(testTalents[0]);
    let expectedTalents = [
        expectedTalent
    ]

    let state: () => RootState = () => ({
        talents: {
            items: testTalents,
            lastBeginsEditing: false
        },
        timer: {
            session: {
                talent: null,
                session: null
            },
            sessions: testSessions
        }
    })

    expect(jokeDispatch(calculateTalentProgression(), state)).toBeCalledWith({
        type: CALCULATE_PROGRESSION,
        payload: {
            talents: expectedTalents,
            sessions: testSessions
        }
    })
});

it("doesn't repeat expirations that have been done before", () => {
    advanceTo(new Date(2020, 3, 21, 8, 0, 0));

    let testTalents = [
        createTalent(0, "Programming", 7, 500, 4000, 2, 7000, 11, true, false, false)
    ]
    expect(testTalents[0].expiring).toBeFalsy();
    expect(testTalents[0].streakObtained).toBeTruthy();

    let today = new Date();
    let twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    let yesterdayEnd = twoDaysAgo;
    // TODO: Potentially implement an hour offset off expiration in the future?
    // Go backwards 4 hours
    // yesterdayEnd.setTime(yesterdayEnd.getTime() - (4*60*60*1000));

    let yesterdayStart = new Date(yesterdayEnd);
    yesterdayStart.setTime(yesterdayEnd.getTime() - (30*60*1000));

    let hitJustBeforeExpirationDate = createSession(0, 0, 7, yesterdayStart, yesterdayEnd);
    hitJustBeforeExpirationDate.ultrasHeld = 2;

    let notHitJustAfterExpirationDate = createSessionWithinWakingDay(1, [10], [0, 29, 59, 999], twoDaysAgo);

    let testSessions = [
        hitJustBeforeExpirationDate,
        notHitJustAfterExpirationDate
    ]

    let expectedTalent = cloneTalent(testTalents[0]);
    expectedTalent.expiring = true;
    expectedTalent.streakObtained = false;
    expectedTalent.burndown = true;
    expectedTalent.goldUltras = 1;
    expectedTalent.progress = 0;
    expectedTalent.streakCount = 0;
    expectedTalent.streakObtained = false;

    expect(expectedTalent).not.toEqual(testTalents[0]);
    expect(expectedTalent).not.toStrictEqual(testTalents[0]);
    let expectedTalents = [
        expectedTalent
    ]

    let state: () => RootState = () => ({
        talents: {
            items: testTalents,
            lastBeginsEditing: false
        },
        timer: {
            session: {
                talent: null,
                session: null
            },
            sessions: testSessions
        }
    })

    let expectedDispatch = {
        type: CALCULATE_PROGRESSION,
        payload: {
            talents: expectedTalents,
            sessions: testSessions
        }
    }

    // Perform an expiration
    expect(jokeDispatch(calculateTalentProgression(), state)).toBeCalledWith(expectedDispatch);

    // Create deep copy of expected results and pass in as new state
    let newState = state();
    newState.talents.items = [
        {...expectedTalent}
    ]
    newState.timer.sessions = testSessions.map(s => ({...s}));
    let newStateFunc = () => newState;

    // Assert that the state of the talent will stay the same and therefore
    // a second expiration didn't occur
    expect(jokeDispatch(calculateTalentProgression(), newStateFunc)).toBeCalledWith(expectedDispatch);
});

it("resets streak and removes multiple ultras for being several days past expiration", () => {
    advanceTo(new Date(2020, 3, 21, 8, 0, 0));

    let testTalents = [
        createTalent(0, "Programming", 7, 500, 4000, 2, 7000, 11, true, false, false)
    ]
    expect(testTalents[0].expiring).toBeFalsy();
    expect(testTalents[0].streakObtained).toBeTruthy();

    let today = new Date();
    let fourDaysAgo = new Date(today);
    fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);

    let yesterdayEnd = fourDaysAgo;
    // TODO: Potentially implement an hour offset off expiration in the future?
    // Go backwards 4 hours
    // yesterdayEnd.setTime(yesterdayEnd.getTime() - (4*60*60*1000));

    let yesterdayStart = new Date(yesterdayEnd);
    yesterdayStart.setTime(yesterdayEnd.getTime() - (30*60*1000));

    let hitJustBeforeExpirationDate = createSession(0, 0, 7, yesterdayStart, yesterdayEnd);
    hitJustBeforeExpirationDate.ultrasHeld = 2;

    let notHitJustAfterExpirationDate = createSessionWithinWakingDay(1, [10], [0, 29, 59, 999], fourDaysAgo);

    let testSessions = [
        hitJustBeforeExpirationDate,
        notHitJustAfterExpirationDate
    ]

    let expectedTalent = cloneTalent(testTalents[0]);
    expectedTalent.expiring = true;
    expectedTalent.streakObtained = false;
    expectedTalent.burndown = true;
    expectedTalent.goldUltras = 0;
    expectedTalent.progress = 0;
    expectedTalent.streakCount = 0;
    expectedTalent.streakObtained = false;

    expect(expectedTalent).not.toEqual(testTalents[0]);
    expect(expectedTalent).not.toStrictEqual(testTalents[0]);
    let expectedTalents = [
        expectedTalent
    ]

    let state: () => RootState = () => ({
        talents: {
            items: testTalents,
            lastBeginsEditing: false
        },
        timer: {
            session: {
                talent: null,
                session: null
            },
            sessions: testSessions
        }
    })

    let expectedDispatch = {
        type: CALCULATE_PROGRESSION,
        payload: {
            talents: expectedTalents,
            sessions: testSessions
        }
    }

    // Perform an expiration
    expect(jokeDispatch(calculateTalentProgression(), state)).toBeCalledWith(expectedDispatch);
});

it("stops burndown and resets the talent to normal when a streak hit is performed today", () => {
    advanceTo(new Date(2020, 3, 21, 8, 0, 0));

    let testTalents = [
        createTalent(0, "Programming", 7, 500, 4000, 2, 7000, 11, false, true, true)
    ]
    expect(testTalents[0].expiring).toBeTruthy();
    expect(testTalents[0].burndown).toBeTruthy();
    expect(testTalents[0].streakObtained).toBeFalsy();

    let hitToday = createSessionWithinWakingDay(0, [5], [0, 30], new Date());

    let testSessions = [hitToday]

    let expectedTalent = cloneTalent(testTalents[0]);
    expectedTalent.expiring = false;
    expectedTalent.streakObtained = true;
    expectedTalent.burndown = false;

    expect(expectedTalent).not.toEqual(testTalents[0]);
    expect(expectedTalent).not.toStrictEqual(testTalents[0]);
    let expectedTalents = [
        expectedTalent
    ]

    let state: () => RootState = () => ({
        talents: {
            items: testTalents,
            lastBeginsEditing: false
        },
        timer: {
            session: {
                talent: null,
                session: null
            },
            sessions: testSessions
        }
    })

    let expectedDispatch = {
        type: CALCULATE_PROGRESSION,
        payload: {
            talents: expectedTalents,
            sessions: testSessions
        }
    }

    // Perform an expiration
    expect(jokeDispatch(calculateTalentProgression(), state)).toBeCalledWith(expectedDispatch);
});

// Integration Tests

beforeEach(() => {
    testTalents = [
        createTalent(0, "Programming"),
        createTalent(1, "Music Creation")
    ]
    model = new LocalTalentModel(testTalents);
    configureModel(model);
})

afterEach(() => {
    model = null;
    configureModel(null);
})

it("creates talent with correct dispatch", () => {
    let expectedTalent = createTalent(2, "My Talent");
    let dis = jokeDispatch(newTalent("My Talent"));
    expect(dis).toBeCalledWith({
        type: NEW_TALENT,
        payload: expectedTalent
    });
})

it("deletes talent with correct dispatch", () => {
    let dis = jokeDispatch(deleteTalent(7));
    expect(dis).toBeCalledWith({
        type: DELETE_TALENT,
        payload: 7
    })
})

it("gets talents with correct dispatch", () => {
    let dis = jokeDispatch(getTalents());
    expect(dis).toBeCalledWith({
        type: GET_TALENTS,
        payload: testTalents
    });
})

it("updates talents with correct dispatch", () => {
    let testTalent = testTalents[0];
    let dis = jokeDispatch(updateTalent(testTalent));
    expect(dis).toBeCalledWith({
        type: UPDATE_TALENT,
        payload: testTalent
    });
});

it("updates talent in model", () => {
    let testTalent = testTalents[0];
    let modelTalent = model.get(testTalent.id);

    expect(testTalent.name).not.toBe("Breakdancing");
    expect(modelTalent.name).not.toBe("Breakdancing");
    expect(modelTalent).toStrictEqual(testTalent);

    testTalent.name = "Breakdancing";

    expect(modelTalent.name).not.toBe("Breakdancing");
    expect(modelTalent).not.toStrictEqual(testTalent);

    jokeDispatch(updateTalent(testTalent));

    modelTalent = model.get(testTalent.id);
    
    expect(modelTalent).not.toBe(testTalent);
    expect(modelTalent).toStrictEqual(testTalent);
})