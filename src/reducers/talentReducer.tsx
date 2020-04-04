import { NEW_TALENT, DELETE_TALENT } from '../actions/types';
import { Talent } from '../models/Talent';
import { deleteTalent, newTalent } from '../actions/talentActions';
import LocalTalentModel from '../models/LocalTalentModel';

export type TalentReducerState = {
    items: Talent[]
}

const initialState = {
    items: new LocalTalentModel().getAll()
}

export default function(state = initialState, action: any) {
    switch (action.type) {
        case NEW_TALENT:
            return newTalent(state, action.payload);
        case DELETE_TALENT:
            return deleteTalent(state, action.payload);
        default:
            return state;
    }
}