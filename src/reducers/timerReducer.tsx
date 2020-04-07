import { Talent } from '../models/Talent';
import { TalentSession } from '../models/TalentSession';
import { START_SESSION, STOP_SESSION, POLL_SESSION } from '../actions/types';

export type TimerReducerState = {
    session: {
        talent: Talent | null,
        session: TalentSession | null
    }
}

const initialState = {
    session: {
        talent: null,
        session: null
    }
}

export default function(state = initialState, action: any) {
    switch (action.type) {
        case START_SESSION:
            return {
                ...state,
                session: action.payload
            }
        case STOP_SESSION:
            return {
                ...state,
                session: {
                    talent: null,
                    session: null
                }
            }
        case POLL_SESSION:
            return {
                ...state,
                session: action.payload
            }
        default:
            return state;
    }
}