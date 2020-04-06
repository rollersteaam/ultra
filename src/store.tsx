import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from './reducers';
import { TalentReducerState } from './reducers/talentReducer';
import { TimerReducerState } from './reducers/timerReducer';

export type RootState = {
    talents: TalentReducerState
    timer: TimerReducerState
}

const initialState = {};

const middleware = [thunk];

const createUltraStore = () =>
    createStore(
        rootReducer,
        initialState,
        applyMiddleware(...middleware)
    );

export default createUltraStore;