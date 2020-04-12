import { TalentSession } from '../models/TalentSession';
import { Talent } from '../models/Talent';
import { START_SESSION, POLL_SESSION, STOP_SESSION, GET_SESSIONS } from './types';
import { IExchangeModel } from '../models/IExchangeModel';
import { updateTalent, excludeTalent, includeTalent } from './talentActions';
import { ITalentIncubator } from '../models/ITalentIncubator';
import { NullTalentIncubator } from '../models/NullTalentIncubator';
import { prettyTimeString } from '../utils/time';

let sessionModel: IExchangeModel<Talent, TalentSession>;

export const configureModel = (model: IExchangeModel<Talent, TalentSession>) => {
    sessionModel = model;
}

const assertModelActive = () => {
    if (sessionModel === null || sessionModel === undefined)
        throw new EvalError("Could not evaluate dispatch action. configureModel() has not been called on this action script.");
}

let incubator: ITalentIncubator = NullTalentIncubator.Null;

export const configureIncubator = (newIncubator: ITalentIncubator) => {
    incubator = newIncubator;
}

export const startSession = (talent: Talent) => (dispatch: any) => {
    assertModelActive();

    if (incubator.isIncubating()) {
        dispatch(stopSession());
    }

    dispatch(excludeTalent(talent.id));

    let session: TalentSession = sessionModel.exchange(talent);

    incubator.incubate(talent, session);

    dispatch({
        type: START_SESSION,
        payload: {talent, session}
    });
}

export const stopSession = () => (dispatch: any) => {
    assertModelActive();

    let bredTalent: Talent | null = incubator.getTalent();

    if (bredTalent === null)
        throw new EvalError("Couldn't stop session. There was no session to stop.");

    dispatch(includeTalent(bredTalent.id));

    // Save the latest changes before stopping
    dispatch(pollSession());
    incubator.stop();

    document.title = "Ultra";

    dispatch({
        type: STOP_SESSION
    });
}

export const pollSession = () => (dispatch: any) => {
    assertModelActive();

    let poll = null;
    try {
        poll = incubator.poll();
    } catch (EvalError) {
        // Return to resolve race condition
        return;
    }

    if (poll === null) return;

    sessionModel.update(poll.session);
    dispatch(updateTalent(poll.talent));

    let timeString = prettyTimeString(poll.session.progressObtained);
    document.title = `${timeString} + ${poll.talent.name} - Ultra`;

    dispatch({
        type: POLL_SESSION,
        payload: poll
    });
}

export const getSessions = () => (dispatch: any) => {
    assertModelActive();
    dispatch({
        type: GET_SESSIONS,
        payload: sessionModel.getAll()
    });
}