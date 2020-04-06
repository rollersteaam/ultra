// Common Test Imports
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import jokeDispatch from '../testutils/jokeDispatch';
import autoStore from '../testutils/autoStore';
import { configureModel as configureSessionModel } from '../actions/timerActions';
import { configureModel as configureTalentModel } from '../actions/talentActions';
import LocalTalentModel from '../models/LocalTalentModel';
import LocalTalentSessionModel from '../models/LocalTalentSessionModel';

import React from 'react'

import { createTalent } from '../models/Talent';
import { startSession, stopSession, pollSession } from './timerActions';
import { START_SESSION, STOP_SESSION, POLL_SESSION } from '../actions/types';
import { TimerReducerState } from '../reducers/timerReducer';

const testTalents = [
    createTalent(0, "Competitive Programming"),
    createTalent(1, "Graphics Programming")
]

beforeEach(() => {
    let talentModel = new LocalTalentModel(testTalents);
    configureTalentModel(talentModel);
    let sessionModel = new LocalTalentSessionModel([]);
    configureSessionModel(sessionModel);
})

// Unit Tests

it("prepares correct request for timing a talent", () => {
    let testTalent = createTalent(0, "A Timely Talent");
    let expectedRequest = {
        type: START_SESSION,
        payload: testTalent
    }
    expect(jokeDispatch(startSession(testTalent)))
        .toBeCalledWith(expectedRequest);
});

it("prepares correct request for stopping talent timing", () => {
    let expectedRequest = {
        type: STOP_SESSION
    }
    expect(jokeDispatch(stopSession()))
        .toBeCalledWith(expectedRequest);
});

it("prepares correct request for timer polling", () => {
    let expectedRequest = {
        type: POLL_SESSION
    }
    expect(jokeDispatch(pollSession()))
        .toBeCalledWith(expectedRequest);
});

// Integration Tests

it("begins timing a talent upon a time talent request", () => {
    const store = autoStore();
    let element = mount(
        <Provider store={store}></Provider>
    )
    const talent = testTalents[1];

    store.dispatch(startSession(talent));

    let state: TimerReducerState = store.getState().timer;
    expect(state.session.timedTalent).toStrictEqual(talent);
    expect(state.session.timedSession).not.toBeFalsy();
    expect(state.session.timedSession.talentId).toBe(talent.id);

    element.unmount();
});

it("stops timing a talent upon a stop timing request", () => {
    const store = autoStore();
    let element = mount(
        <Provider store={store}></Provider>
    )
    const talent = testTalents[1];
    
    store.dispatch(startSession(talent));
    
    let state: TimerReducerState = store.getState().timer;
    expect(state.session.timedTalent).toStrictEqual(talent);
    expect(state.session.timedSession).not.toBeFalsy();
    expect(state.session.timedSession.talentId).toBe(talent.id);
    
    store.dispatch(stopSession());
    
    state = store.getState().timer;
    expect(state.session.timedTalent).toBeNull();
    expect(state.session.timedSession).toBeNull();

    element.unmount();
});

it("refreshes session information upon a poll timer request", () => {
    jest.useFakeTimers();

    const store = autoStore();
    let element = mount(
        <Provider store={store}></Provider>
    )
    const talent = testTalents[1];
    
    let state: TimerReducerState = store.getState().timer;
    expect(state.session.timedTalent).toBeNull();
    expect(state.session.timedSession).toBeNull();

    store.dispatch(startSession(talent));
    
    state = store.getState().timer;
    expect(state.session.timedTalent).toStrictEqual(talent);
    expect(state.session.timedSession).not.toBeFalsy();
    expect(state.session.timedSession.talentId).toBe(talent.id);

    let previousSession = state.session;

    // Ekko time ;)
    jest.advanceTimersByTime(1000);

    store.dispatch(pollSession());

    state = store.getState().timer;
    
    // Assert that the session references are different (and thus changed)
    expect(state.session).not.toBe(previousSession);
    
    // Assert it is the same session
    expect(state.session.timedSession.id).toBe(previousSession.timedSession.id);
    expect(state.session.timedSession.userId)
        .toBe(previousSession.timedSession.userId);
    expect(state.session.timedTalent.id)
        .toBe(previousSession.timedTalent.id);
    expect(state.session.timedTalent.userId)
        .toBe(previousSession.timedTalent.userId);

    // Assert that progress has been made
    expect(state.session.timedSession.progressObtained)
        .toBeGreaterThan(previousSession.timedSession.progressObtained);
    expect(state.session.timedTalent.progress)
        .toBeGreaterThan(previousSession.timedTalent.progress);
    expect(state.session.timedTalent.totalSeconds)
        .toBeGreaterThan(previousSession.timedTalent.totalSeconds);

    element.unmount();
});