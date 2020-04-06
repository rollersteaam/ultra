import { NEW_TALENT, DELETE_TALENT, GET_TALENTS } from '../actions/types';
import { Talent } from '../models/Talent';

export type TalentReducerState = {
    items: Talent[]
}

const initialState: TalentReducerState = {
    items: []
}

export default function(state = initialState, action: any) {
    switch (action.type) {
        case GET_TALENTS:
            let talents: Talent[] = action.payload;
            return {
                ...state,
                items: talents
            }
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
            let id: number = action.payload;
            let newItems = state.items.filter(tal => tal.id !== id);
            return {
                ...state,
                items: newItems
            }
        default:
            return state;
    }
}