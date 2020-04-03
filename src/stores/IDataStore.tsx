import { AppState } from '../App';


interface IDataStore {
    deleteTalent(id: number): void;
    createTalent(name: string): void;
    getInitialDataCopy(): AppState;
}

export default IDataStore;