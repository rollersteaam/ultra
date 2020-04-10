import { newTalent, deleteTalent, getTalents, configureModel, updateTalent, excludeTalent, includeTalent, calculateTalentProgression }  from './talentActions';
import { NEW_TALENT, DELETE_TALENT, GET_TALENTS, UPDATE_TALENT, EXCLUDE_TALENT, INCLUDE_TALENT, CALCULATE_PROGRESSION } from './types';
import jokeDispatch from '../testutils/jokeDispatch';
import { createTalent, Talent, cloneTalent } from '../models/Talent';
import IModel from '../models/IModel';
import LocalTalentModel from '../models/LocalTalentModel';
import { createSession } from '../models/TalentSession';
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

it("correctly calculates a talent as expiring", () => {
    advanceTo(new Date(2020, 3, 21, 8, 0, 0));

    let testTalents = [
        createTalent(0, "Programming", 7, 0, 40, 0, 0, 0, true, false)
    ]
    expect(testTalents[0].expiring).toBeFalsy();
    expect(testTalents[0].streakObtained).toBeTruthy();

    let today = new Date();

    let yesterdayEnd = new Date(today);
    yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);
    // Go backwards 4 hours
    yesterdayEnd.setTime(yesterdayEnd.getTime() - (4*60*60*1000));
    // Minus 1 milliseconds to fall within boundary
    yesterdayEnd.setTime(yesterdayEnd.getTime() - 1);

    let yesterdayStart = new Date(yesterdayEnd);
    yesterdayStart.setTime(yesterdayEnd.getTime() - (30*60*1000));

    let testSessions = [
        createSession(0, 0, 7, yesterdayStart, yesterdayEnd)
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

it("correctly calculates a talent as streak not obtained when a session starting from yesterday ends today", () => {
    advanceTo(new Date(2020, 3, 21, 8, 0, 0));

    let testTalents = [
        createTalent(0, "Programming", 7, 0, 40, 0, 0, 0, true, false)
    ]
    expect(testTalents[0].streakObtained).toBeTruthy();

    let today = new Date();

    let yesterdayEnd = new Date(today);
    // yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);
    // yesterdayEnd.setHours(23, 59, 59, 999);
    // Failure Edge Case: Sessions that end at the very beginning of a day can't
    //      gain a streak. This is pretty unfair.
    // yesterdayEnd.setHours(0, 0, 0, 1);

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

it("correctly calculates a streak is not obtained when no session today has lasted 30 minutes", () => {

});

it("correctly calculates a talent as not expiring", () => {
    advanceTo(new Date(2020, 3, 21, 8, 0, 0));

    let testTalents = [
        createTalent(0, "Programming", 7, 0, 40, 0, 0, 0, false, true)
    ]
    expect(testTalents[0].expiring).toBeTruthy();
    expect(testTalents[0].streakObtained).toBeFalsy();

    let today = new Date();

    let yesterdayEnd = new Date(today);
    yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);
    // Go backwards 4 hours
    yesterdayEnd.setTime(yesterdayEnd.getTime() - (4 * 60 * 60 * 1000));
    // Plus 1 ms to fall within non-expiration boundary
    yesterdayEnd.setTime(yesterdayEnd.getTime() + 1);

    let yesterdayStart = new Date(yesterdayEnd);
    yesterdayStart.setTime(yesterdayEnd.getTime() - (30*60*1000));

    let testSessions = [
        createSession(0, 0, 7, yesterdayStart, yesterdayEnd)
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

it("resets a talent's streak and removes 1 ultra when past expiration", () => {

});

it("doesn't repeat expirations on every progression calculation", () => {
    // Could use an "evaluated" flag on sessions to accomplish this
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

it("new talent creates new talent in state", () => {

});

it("new talent is saved across page reloads", () => {

});

it("deletes talent from ", () => {

})

it("delete talent is saved across page reloads", () => {
    
});