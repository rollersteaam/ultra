import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from './reducers';
import Talent from './models/Talent';
import { TalentReducerState } from './reducers/talentReducer';

export type RootState = {
    talents: TalentReducerState
}

const initialState = {};

const middleware = [thunk];

const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(...middleware)
);

export default store;