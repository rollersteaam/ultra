import { Talent, createTalent } from '../models/Talent';
import IModel from '../models/IModel';
import { NEW_TALENT, DELETE_TALENT, GET_TALENTS, UPDATE_TALENT, EXCLUDE_TALENT, INCLUDE_TALENT, CALCULATE_PROGRESSION } from './types';
import { RootState } from '../store';
import { TalentSession } from '../models/TalentSession';

let talentModel: IModel<Talent>;

/**
 * Changes how actions will interact with talent data, and how talent data
 * will be stored.
 * @param model A model object that manages talent data.
 */
export const configureModel = (model: IModel<Talent>) => {
    talentModel = model;
}

const assertModelActive = () => {
    if (talentModel === null || talentModel === undefined)
        throw new EvalError("Could not evaluate dispatch action. configureModel() has not been called on this action script.");
}

export const getTalents = () => (dispatch: any) => {
    assertModelActive();
    let talents = talentModel.getAll();
    dispatch({
        type: GET_TALENTS,
        payload: talents
    })
}

export const newTalent = (name: string) => (dispatch: any) => {
    assertModelActive();
    let newTalent = talentModel.create(createTalent(0, name));
    dispatch({
        type: NEW_TALENT,
        payload: newTalent
    });
}

export const deleteTalent = (id: number) => (dispatch: any) => {
    assertModelActive();
    talentModel.deleteId(id);
    dispatch({
        type: DELETE_TALENT,
        payload: id
    });
}

export const updateTalent = (talent: Talent) => (dispatch: any) => {
    assertModelActive();
    let modelTalent = talentModel.update(talent);
    dispatch({
        type: UPDATE_TALENT,
        payload: modelTalent
    });
}

export const excludeTalent = (id: number) => (dispatch: any) => {
    dispatch({
        type: EXCLUDE_TALENT,
        payload: id
    });
}

export const includeTalent = (id: number) => (dispatch: any) => {
    assertModelActive();
    let modelTalent = talentModel.get(id);
    dispatch({
        type: INCLUDE_TALENT,
        payload: modelTalent
    });
}

export const calculateTalentProgression = () => (dispatch: any, getState: () => RootState) => {
    const { talents, timer } = getState();
    let talentsData = talents.items;
    let sessionsData = timer.sessions;
    
    if (sessionsData.length === 0)
        return

    if (talentsData.length === 0)
        return

    let currentDate = new Date();
    for (let talent of talentsData) {
        let sessions = sessionsData.filter(s => s.talentId === talent.id);

        // Move on and don't modify talent data, talent has never been timed
        if (sessions.length === 0)
            continue;

        let reset = new Date(currentDate);
        reset.setHours(4, 0, 0, 0);
        
        // Move back a waking day if we're between the 0 AM - 4 AM time range
        if (currentDate.getTime() <= reset.getTime()) {
            reset.setDate(reset.getDate() - 1);
        }

        // Calculate whether a streak hit is available

        let todaysSessions = sessions.filter(s => s.startTimestamp.getTime() >= reset.getTime());

        let todaysHits = todaysSessions.filter(s => {
            if (!s.endTimestamp)
                throw new EvalError("Couldn't calculate talent progression. Two sessions haven't been marked as ended. Data is possibly corrupted.");
                // return false;

            return s.endTimestamp.getTime() - s.startTimestamp.getTime() >= 1800000
        });

        talent.streakObtained = todaysHits.length > 0;

        // Calculate whether talent is expiring

        let hits = sessions
            .filter(s => {
                if (!s.endTimestamp)
                    throw new EvalError("Couldn't calculate talent progression. Transcendent timers aren't implemented yet. Data is possibly corrupted.")
                
                return s.endTimestamp.getTime() - s.startTimestamp.getTime() >= 1800000
            });

        let latestHit: TalentSession | null = null;
        if (hits.length > 0) {
            latestHit = hits.reduce((cur, next, i, arr) =>
                next.endTimestamp!.getTime() > cur.endTimestamp!.getTime() ? next : cur
            );
        }

        // Mark talent as expiring if last hit was before expiry date
        if (latestHit) {
            let pastExpiryDate = latestHit.endTimestamp!.getTime() <= currentDate.getTime() - (28 * 60 * 60 * 1000);
            talent.expiring = pastExpiryDate;
        }

        // Calculate talent burndown

        if (latestHit) {
            let expirationDateMs =
                currentDate.getTime() - (48 * 60 * 60 * 1000);
            let hitEndMs = latestHit.endTimestamp!.getTime();

            let isBurningDown = hitEndMs <= expirationDateMs;

            talent.burndown = isBurningDown;

            if (isBurningDown) {
                let nDays = (expirationDateMs - hitEndMs) / (24 * 60 * 60 * 1000);
                let ultrasLost = 1 + Math.floor(nDays);

                // Bye bye :(
                talent.goldUltras = Math.max(latestHit.ultrasHeld - ultrasLost, 0);
                talent.progress = 0;
                talent.streakCount = 0;
            }
        }
    }

    dispatch({
        type: CALCULATE_PROGRESSION,
        payload: {
            talents: talentsData,
            sessions: sessionsData
        }
    });
}