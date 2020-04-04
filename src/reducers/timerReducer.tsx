import { Talent } from '../models/Talent';
import TalentSession from '../models/TalentSession';

export type TimerReducerState = {
    session: {
        timedTalent: Talent | null,
        timedSession: TalentSession | null
    }
}

const initialState = {
    session: {
        timedTalent: null,
        timedSession: null
    }
}

export default function(state = initialState, action: any) {
    switch (action.type) {
        default:
            return state;
    }
}