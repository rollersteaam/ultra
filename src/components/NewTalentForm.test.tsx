import React from 'react';

import { Provider } from "react-redux";
import { mount } from "enzyme";
import { act } from 'react-dom/test-utils';

import NewTalentForm from './NewTalentForm';
import autoStore from '../testutils/autoStore';
import { createTalent } from '../models/Talent';
import '../modelSetup';

// Unit Tests

let element;

afterEach(() => {
    element.unmount();
    element = null;
})

it("renders without crashing", () => {
    const store = autoStore();
    element = mount(<Provider store={store}><NewTalentForm /></Provider>);
});

// Integration Tests

it("adds talent to store when pressing enter", () => {
    const store = autoStore();
    element = mount(
        <Provider store={store}>
            <NewTalentForm />
        </Provider>
    );
    const expectedTalent = createTalent(0, "My New Talent");

    let inputEl = element.find("[test-id='newTalentForm.Input']").at(1);
    inputEl.simulate("change", {target: {value: "My New Talent"}});
    inputEl.simulate("submit");

    expect(store.getState().talents.items).toContainEqual(expectedTalent);
});