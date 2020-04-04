import { combineReducers } from 'redux';
import talentReducer from './talentReducer';

export default combineReducers({
    talents: talentReducer
});