import timerReducer, { TimerReducerState } from "./timerReducer";
import { START_SESSION, STOP_SESSION, POLL_SESSION, GET_SESSIONS } from '../actions/types';
import { createTalent, cloneTalent } from "../models/Talent";
import { createSession, cloneSession } from "../models/TalentSession";

// Unit Tests

it("puts a timed talent into state", () => {
    let testState: TimerReducerState = {
        session: {
            talent: null,
            session: null
        },
        sessions: []
    }
    let testTalent = createTalent(2, "Programming", 7);
    let testSession = createSession(3, 2, 7);
    let startPayload = {
        type: START_SESSION,
        payload: {
            talent: testTalent,
            session: testSession
        }
    }

    let newState = timerReducer(testState, startPayload);
    
    expect(newState).toStrictEqual({
        session: {
            talent: testTalent,
            session: testSession
        },
        sessions: []
    });
});

it("removes a timed talent from state when stop request sent", () => {
    let testTalent = createTalent(2, "Programming", 7);
    let testSession = createSession(3, 2, 7);
    let testState: TimerReducerState = {
        session: {
            talent: testTalent,
            session: testSession
        },
        sessions: []
    }
    let stopPayload = {
        type: STOP_SESSION,
    }

    let newState = timerReducer(testState, stopPayload);
    
    expect(newState).toStrictEqual({
        session: {
            talent: null,
            session: null
        },
        sessions: []
    });
});

it("updates state with new session info on a valid timer poll request", () => {
    let testTalent = createTalent(2, "Programming", 7);
    let testSession = createSession(3, 2, 7);
    let initialState: TimerReducerState = {
        session: {
            talent: cloneTalent(testTalent),
            session: cloneSession(testSession)
        },
        sessions: []
    }

    testTalent.name = "Whatever's Left Inside";
    testTalent.progress += 2;
    testSession.progressObtained += 2;

    let expectedState: TimerReducerState = {
        session: {
            talent: testTalent,
            session: testSession
        },
        sessions: [
            testSession
        ]
    }

    let updatePayload = {
        type: POLL_SESSION,
        payload: {
            talent: testTalent,
            session: testSession
        }
    }

    let newState = timerReducer(initialState, updatePayload);
    
    expect(newState).not.toStrictEqual(initialState);
    expect(newState).toStrictEqual(expectedState);
})

it("gets all stored sessions into state", () => {
    let testSessions = [
        createSession(0, 0, 7),
        createSession(1, 2, 7)
    ]

    let initialState: TimerReducerState = {
        session: {
            talent: null,
            session: null,
        },
        sessions: []
    }

    let expectedState: TimerReducerState = {
        session: {
            talent: null,
            session: null,
        },
        sessions: testSessions
    }

    let getPayload = {
        type: GET_SESSIONS,
        payload: testSessions
    }

    let newState = timerReducer(initialState, getPayload);

    expect(newState).not.toStrictEqual(initialState);
    expect(newState).toStrictEqual(expectedState);
})