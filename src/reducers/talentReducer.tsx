import { NEW_TALENT, DELETE_TALENT } from '../actions/types';
import Talent from '../models/Talent';
import { deleteTalent, newTalent } from '../actions/talentActions';

export type TalentReducerState = {
    items: Talent[]
}

const initialState = {
    items: [
        {
            id: 0,
            name: "Programming"
        },
        {
            id: 1,
            name: "Music Creation"
        },
        {
            id: 2,
            name: "Apricots"
        },
        {
            id: 3,
            name: "Pineapples"
        }
    ]
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