import { NEW_TALENT, DELETE_TALENT } from '../actions/types';
import { Talent } from '../models/Talent';
import { deleteTalent, newTalent } from '../actions/talentActions';

export type TalentReducerState = {
    items: Talent[]
}

const initialState: TalentReducerState = {
    items: []
}

export default function(state = initialState, action: any) {
    switch (action.type) {
        case NEW_TALENT:
            let newTalent: Talent = action.payload;
            return {
                ...state,
                items: [
                    ...state.items,
                    newTalent
                ]
            }
        case DELETE_TALENT:
            return deleteTalent(state, action.payload);
        default:
            return state;
    }
}