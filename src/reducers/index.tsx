import { combineReducers } from 'redux';
import talentReducer from './talentReducer';
import timerReducer from './timerReducer';

export default combineReducers({
    talents: talentReducer,
    timer: timerReducer
});