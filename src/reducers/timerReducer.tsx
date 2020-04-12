import { Talent } from '../models/Talent';
import { TalentSession } from '../models/TalentSession';
import { START_SESSION, STOP_SESSION, POLL_SESSION, GET_SESSIONS } from '../actions/types';

export type TimerReducerState = {
    session: {
        talent: Talent | null,
        session: TalentSession | null
    },
    sessions: TalentSession[]
}

const initialState = {
    session: {
        talent: null,
        session: null
    },
    sessions: []
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
                sessions: [
                    state.sessions.filter((s: TalentSession) => s.id !== action.payload.id),
                    action.payload
                ],
                session: action.payload
            }
        case GET_SESSIONS:
            return {
                ...state,
                sessions: action.payload
            }
        default:
            return state;
    }
}