import React from 'react'

import { advanceTo, advanceBy } from 'jest-date-mock';

// Common Test Imports
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import jokeDispatch from '../testutils/jokeDispatch';
import autoStore from '../testutils/autoStore';
import { configureModel as configureSessionModel, configureIncubator } from '../actions/timerActions';
import { configureModel as configureTalentModel } from '../actions/talentActions';
import LocalTalentModel from '../models/LocalTalentModel';
import LocalTalentSessionModel from '../models/LocalTalentSessionModel';

import { createTalent } from '../models/Talent';
import { startSession, stopSession, pollSession } from './timerActions';
import { START_SESSION, STOP_SESSION, POLL_SESSION } from '../actions/types';
import { TimerReducerState } from '../reducers/timerReducer';
import { createSession } from '../models/TalentSession';
import { NullTalentIncubator } from '../models/NullTalentIncubator';
import { TalentIncubator } from '../models/TalentIncubator';
import { ITalentIncubator } from '../models/ITalentIncubator';
import { Talent } from '../models/Talent';
import { TalentSession } from '../models/TalentSession';
import { MockTalentIncubator } from '../testutils/MockTalentIncubator';

const testTalents = [
    createTalent(0, "Competitive Programming"),
    createTalent(1, "Graphics Programming")
]

beforeEach(() => {
    let talentModel = new LocalTalentModel(testTalents);
    configureTalentModel(talentModel);
    let sessionModel = new LocalTalentSessionModel([]);
    configureSessionModel(sessionModel);
    configureIncubator(NullTalentIncubator.Null);
})

afterEach(() => {
    configureIncubator(NullTalentIncubator.Null);
})

// Unit Tests

it("prepares correct payload for timing a talent", () => {
    advanceTo(new Date());

    let testTalent = createTalent(0, "A Timely Talent");
    let testSession = createSession(0, 0, 0, new Date());
    let expectedRequest = {
        type: START_SESSION,
        payload: { talent: testTalent, session: testSession }
    }
    expect(jokeDispatch(startSession(testTalent)))
        .toBeCalledWith(expectedRequest);
});

it("prepares correct payload for stopping talent timing", () => {
    class TestIncubator extends MockTalentIncubator {
        getTalent(): Talent | null {
            return createTalent(0, "Dummy", 7);
        }

        stop() : void {}
    }

    configureIncubator(new TestIncubator());

    let expectedRequest = {
        type: STOP_SESSION
    }
    expect(jokeDispatch(stopSession()))
        .toBeCalledWith(expectedRequest);
});

it("throws when stopping session with no talent incubating", () => {
    class TestIncubator extends MockTalentIncubator {
        getTalent(): Talent | null {
            return null;
        }

        stop() : void {}
    }

    configureIncubator(new TestIncubator());

    expect(() => jokeDispatch(stopSession())).toThrowError(EvalError);
})

// Integration Tests

it("begins timing a talent upon a time talent request", () => {
    const store = autoStore();
    let element = mount(
        <Provider store={store}></Provider>
    )
    const talent = testTalents[1];

    store.dispatch(startSession(talent));

    let state: TimerReducerState = store.getState().timer;
    expect(state.session.talent).toStrictEqual(talent);
    expect(state.session.session).not.toBeFalsy();
    expect(state.session.session.talentId).toBe(talent.id);

    element.unmount();
});

it("stops timing a talent upon a stop timing request", () => {
    const talent = testTalents[1];
    
    class TestIncubator extends MockTalentIncubator {
        getTalent(): Talent | null {
            return talent;
        }

        incubate(talent: Talent, session: TalentSession) {}

        isIncubating(): boolean {
            return false;
        }

        stop() {}
    }

    configureIncubator(new TestIncubator());
    
    const store = autoStore();
    let element = mount(
        <Provider store={store}></Provider>
    )
    
    store.dispatch(startSession(talent));
    
    let state: TimerReducerState = store.getState().timer;
    expect(state.session.talent).toStrictEqual(talent);
    expect(state.session.session).not.toBeFalsy();
    expect(state.session.session.talentId).toBe(talent.id);
    
    store.dispatch(stopSession());
    
    state = store.getState().timer;
    expect(state.session.talent).toBeNull();
    expect(state.session.session).toBeNull();

    element.unmount();
});

it("refreshes session information upon a poll timer request", () => {
    configureIncubator(new TalentIncubator());
    advanceTo(new Date());

    const store = autoStore();
    let element = mount(
        <Provider store={store}></Provider>
    )
    const talent = testTalents[1];
    
    let state: TimerReducerState = store.getState().timer;
    expect(state.session.talent).toBeNull();
    expect(state.session.session).toBeNull();

    store.dispatch(startSession(talent));
    
    state = store.getState().timer;
    expect(state.session.talent).toStrictEqual(talent);
    expect(state.session.session).not.toBeFalsy();
    expect(state.session.session.talentId).toBe(talent.id);

    let previousSession = state.session;

    // Ekko time ;)
    advanceBy(1000);

    store.dispatch(pollSession());

    state = store.getState().timer;
    
    // Assert that the session references are different (and thus changed)
    expect(state.session).not.toBe(previousSession);
    
    // Assert it is the same session
    expect(state.session.session.id).toBe(previousSession.session.id);
    expect(state.session.session.userId)
        .toBe(previousSession.session.userId);
    expect(state.session.talent.id)
        .toBe(previousSession.talent.id);
    expect(state.session.talent.userId)
        .toBe(previousSession.talent.userId);

    // Assert that progress has been made
    expect(state.session.session.progressObtained)
        .toBeGreaterThan(previousSession.session.progressObtained);
    expect(state.session.talent.progress)
        .toBeGreaterThan(previousSession.talent.progress);
    expect(state.session.talent.totalSeconds)
        .toBeGreaterThan(previousSession.talent.totalSeconds);

    element.unmount();
});