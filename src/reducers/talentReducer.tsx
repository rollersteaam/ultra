import { NEW_TALENT, DELETE_TALENT, GET_TALENTS, EXCLUDE_TALENT, INCLUDE_TALENT, UPDATE_TALENT } from '../actions/types';
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
                items: talents.sort((a, b) => a.id > b.id ? 1 : -1)
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
        case UPDATE_TALENT:
            let payload: Talent = action.payload;

            // Update item if its already in the list, else its likely being
            // timed inside incubator
            let i = state.items.findIndex(tal => tal.id === payload.id)
            if (i === -1)
                return state

            let items = state.items.filter(tal => tal.id !== payload.id);

            return {
                ...state,
                items: [
                    ...items,
                    payload
                ]
            }
        case EXCLUDE_TALENT:
            let targetId = action.payload;
            let exclusionItems = state.items.filter(tal => tal.id !== targetId);
            return {
                ...state,
                items: exclusionItems
            }
        case INCLUDE_TALENT:
            let includeItem: Talent = action.payload;
            return {
                ...state,
                items: [
                    ...state.items,
                    includeItem
                ].sort((a, b) => a.id > b.id ? 1 : -1)
            }
        default:
            return state;
    }
}