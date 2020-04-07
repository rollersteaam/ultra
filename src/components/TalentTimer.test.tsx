import React from 'react';

import { Provider, useSelector } from "react-redux";
import { mount, shallow } from "enzyme";
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import '../modelSetup';
import autoStore from '../testutils/autoStore';
import { createTalent } from "../models/Talent";
import { createSession } from "../models/TalentSession";
import TalentTimer from '../components/TalentTimer';
import { startSession, configureIncubator } from '../actions/timerActions';
import { RootState } from '../store';
import { TalentIncubator } from '../models/TalentIncubator';
import { NullTalentIncubator } from '../models/NullTalentIncubator';

afterEach(() => {
    configureIncubator(NullTalentIncubator.Null);
})

// Unit Tests

it("renders hint when no talent assigned", () => {

});

// Collaboration Tests

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

it("executes stop action on clicking stop", () => {
    let talent = createTalent(0, "Test", 7);
    let session = createSession(0, 0, 7);

    const store = mockStore({});

    const TestComponent = () => {
        return (
            <Provider store={store}>
                <TalentTimer talent={talent} session={session} />
            </Provider>
        )
    }
    let element = mount(<TestComponent />);

    element.find("[test-id='talentTimer.stop']")
        .at(1)
        .simulate("click");

    let expectedPayload = {
        type: 'STOP_SESSION'
    }
    expect(store.getActions()).toEqual([expectedPayload]);
})

// Integration Tests

it("polls sessions periodically", () => {
    configureIncubator(new TalentIncubator());

    jest.useFakeTimers();

    const store = autoStore();

    let talent = createTalent(0, "Programming", 7);
    let session = createSession(0, 0, 7);

    store.dispatch(startSession(talent));

    const TestApp = () => {
        let state = useSelector((state: RootState) => state.timer);
        let { talent, session } = state.session;
        return (
            <TalentTimer talent={talent} session={session} />
        );
    }
    let element = mount(
        <Provider store={store}>
            <TestApp />
        </Provider>
    );

    let oneStep = store.getState().timer.session;

    jest.advanceTimersByTime(300);

    let twoStep = store.getState().timer.session;

    expect(twoStep).not.toStrictEqual(oneStep);
});

it("renders talent data", () => {

});

it("renders talent progress data", () => {

});

it("clicking stop stops progressing talent", () => {

});

it("talent progresses when assigned", () => {
    
});