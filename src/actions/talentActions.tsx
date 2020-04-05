import { TalentReducerState } from '../reducers/talentReducer';
import { Talent } from '../models/Talent';
import LocalTalentModel from '../models/LocalTalentModel';
import IModel from '../models/IModel';
import { NEW_TALENT, DELETE_TALENT, GET_TALENTS } from './types';

let talentModel: IModel<Talent>;

/**
 * Changes how actions will interact with talent data, and how talent data
 * will be stored.
 * @param model A model object that manages talent data.
 */
export const configureModel = (model: IModel<Talent>) => {
    talentModel = model;
}

export const getTalents = () => (dispatch: any) => {
    let talents = talentModel.getAll();
    dispatch({
        type: GET_TALENTS,
        payload: talents
    })
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