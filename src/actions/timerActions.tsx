// Make polling timer from TalentTimer view object to repeatedly send dispatch requests?
// Maybe use sockets? Toggl style system, set it up with backend, should be easy with feather, etc.
// Hide away request latency from server's authoritative model of the talent's progression and or talent's session

import TalentSession from '../models/TalentSession';
import IModel from '../models/IModel';
import { Talent } from '../models/Talent';
import { TIME_TALENT } from './types';

let sessionModel: IModel<TalentSession>;

export const configureModel = (model: IModel<TalentSession>) => {
    sessionModel = model;
}

export const startTalent = (talent: Talent) => (dispatch: any) => {
    // let session: TalentSession = sessionModel.create(talent);
    // const payload = {
    //     talent: talent,
    //     session: session
    // };
    // dispatch({
    //     type: TIME_TALENT,
    //     payload: payload
    // });
}