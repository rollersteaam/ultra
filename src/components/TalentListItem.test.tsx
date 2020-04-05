import React, { DOMElement } from 'react';
import ReactDOM, { render, unmountComponentAtNode } from 'react-dom';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';

import store from '../store';
import TalentListItem from '../components/TalentListItem';
import TalentTimer from '../components/TalentTimer';



// Unit Tests

it("renders talent data", () => {

});

// Integration Tests

it("deletes talent from list", () => {

});

it("starts timing a talent when clicking the start button", () => {
    // Assert nothing is being timed


    // act(() => {
    //     render(
    //         <Provider store={store}>
    //             <TalentTimer talent={} session={} />
    //             <TalentListItem talent={} />
    //         </Provider>
    //     , container);
    // });
    
    // Assert talent is being timed
});