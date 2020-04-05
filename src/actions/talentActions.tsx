import { TalentReducerState } from '../reducers/talentReducer';
import { Talent } from '../models/Talent';
import LocalTalentModel from '../models/LocalTalentModel';
import IModel from '../models/IModel';
import { NEW_TALENT, DELETE_TALENT } from './types';

let talentModel: IModel<Talent> = new LocalTalentModel();

export const configureModel = (model: IModel<Talent>) => {
    talentModel = model;
}

export const newTalent = (name: string) => (dispatch: any) => {
    let newTalent = talentModel.create(name);
    dispatch({
        type: NEW_TALENT,
        payload: newTalent
    });
}

export const deleteTalent = (id: number) => (dispatch: any) => {
    talentModel.deleteId(id);
    dispatch({
        type: DELETE_TALENT,
        payload: id
    });
}