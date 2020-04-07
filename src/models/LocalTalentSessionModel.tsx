import TalentSession, { createSession, cloneSession } from './TalentSession';
import { IExchangeModel } from './IExchangeModel';
import { Talent } from './Talent';
import SimpleModel from './SimpleModel';

export default class LocalTalentSessionModel extends SimpleModel<TalentSession> implements IExchangeModel<Talent, TalentSession> {
    constructor(initialTalentSessions: TalentSession[] = []) {
        let kvPairs;
        if (initialTalentSessions.length > 0) {
            kvPairs = initialTalentSessions.map(s => [s.id, s]);
        } else {
            kvPairs = JSON.parse(localStorage.getItem("sessions") ?? "[]");
        }

        super(kvPairs, cloneSession, (el) => el.id, (el, id) => el.id = id);
    }

    exchange(seed: Talent): TalentSession {
        let modelSession = super.create(
            createSession(this.counter, seed.id, seed.userId, new Date(), null, 0)
        );
        return modelSession;
    }
}