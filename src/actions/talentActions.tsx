import { useSelector } from 'react-redux';

import { NEW_TALENT, DELETE_TALENT } from './types';
import { RootState } from '../store';
import { TalentReducerState } from '../reducers/talentReducer';
import Talent from '../models/Talent';

let counter: number = 3;

export const newTalent = (state: TalentReducerState, name: string): TalentReducerState => {
    counter++;
    const newTalent: Talent = {
        id: counter,
        name: name
    };
    const newTalents = [...state.items, newTalent];
    return {
        ...state,
        items: newTalents
    }
}

export const deleteTalent = (state: TalentReducerState, id: number): TalentReducerState => {
    const newTalents = state.items.filter(talent => talent.id !== id);
    return {
        ...state,
        items: newTalents
    };
}