import LocalStorageModel from './LocalStorageModel';
import TalentSession from './TalentSession';

class LocalTalentSessionModel extends LocalStorageModel<TalentSession> {
    create(name: string): TalentSession {
        let session = super.create(name);
        setInterval(() => {
            // update model and increase progress
        }, 500);
        // Options:
        // TODO: A - Make UI component poll dispatches to get new progress?
        // TODO: B - Make action pass dispatch to us or someone else and
        //      poll dispatches to create state updates in app
        return session;
    }
}