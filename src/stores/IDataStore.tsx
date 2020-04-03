import { AppState } from '../App';


interface IDataStore {
    deleteTalent(id: number): void;
    getInitialDataCopy(): AppState;
}

export default IDataStore;