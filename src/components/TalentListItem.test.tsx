import React, { DOMElement } from 'react';
import ReactDOM, { render, unmountComponentAtNode } from 'react-dom';
import { Provider, useSelector } from 'react-redux';
import { act } from 'react-dom/test-utils';
import { isNullOrUndefined } from 'util';

import { mount, ReactWrapper } from 'enzyme'

import TalentListItem from '../components/TalentListItem';
import TalentTimer from '../components/TalentTimer';
import { Talent, createTalent } from '../models/Talent';
import autoStore from '../testutils/autoStore';
import { newTalent } from '../actions/talentActions';
import LocalTalentModel from '../models/LocalTalentModel';
import { configureModel } from '../actions/talentActions';
import { RootState } from '../store';

// Unit Tests

let element: ReactWrapper;

afterEach(() => {
    if (element) {
        element.unmount();
    }
    element = null;
})

it("renders talent data", () => {
    // const store = autoStore();
    // let testTalent: Talent = createTalent(0, "Embrace");
    // element = mount(
    //     <Provider store={store}>
    //         <TalentListItem talent={testTalent} />
    //     </Provider>
    // );
    // expect(element.find("[test-id='talentName']").contains(testTalent.name)).toBeTruthy();

    // TODO: Finish test
});

// Integration Tests

it("deletes talent from list", () => {
    
});

it("starts timing a talent when clicking the start button", () => {
    // Arrange
    const testTalents = [
        createTalent(0, "Dancing")
    ]
    configureModel(new LocalTalentModel(testTalents));

    const store = autoStore();
    
    const dancingTalent = testTalents[0];

    const TestApp = () => {
        const timerState = useSelector((state: RootState) => state.timer);
        const { timedTalent, timedSession } = timerState.session;
        return <>
            <TalentTimer talent={timedTalent} session={timedSession} />
            <TalentListItem talent={dancingTalent} />
        </>
    }
    element = mount(
        <Provider store={store}>
            <TestApp />
        </Provider>
    );

    // Assert that the test talent is not already being timed
    expect(element.find("[test-id='talentTimer.talentName']")
        .contains(dancingTalent.name)).toBeFalsy();

    // Click the start button using at(1) because Bootstrap is an apricot
    //      mushroom and decides to create a child element with the same id
    //      resulting in 2 elements on the result of find()
    element.find(`[test-id='talentListItem.${dancingTalent.id}.startTalent']`)
        .at(1)
        .simulate("click");

    // Assert that the test talent is now being timed
    act(() => {
        expect(element.find("[test-id='talentTimer.talentName']")
            .contains(dancingTalent.name)).toBeTruthy();
    })
});