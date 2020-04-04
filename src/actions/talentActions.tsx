import { TalentReducerState } from '../reducers/talentReducer';
import { Talent } from '../models/Talent';
import LocalTalentModel from '../models/LocalTalentModel';
import IModel from '../models/IModel';

const talentModel: IModel<Talent> = new LocalTalentModel();

export const newTalent = (state: TalentReducerState, name: string): TalentReducerState => {
    let newTalent = talentModel.create(name);
    const newTalents = [...state.items, newTalent];
    return {
        ...state,
        items: newTalents
    }
}

export const deleteTalent = (state: TalentReducerState, id: number): TalentReducerState => {
    talentModel.deleteId(id);
    return {
        ...state,
        items: talentModel.getAll()
    };
}