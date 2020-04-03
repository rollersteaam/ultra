import ITalentController from "./ITalentController";
import IDataStore from '../stores/IDataStore';

class TalentController implements ITalentController {
    private dataStore: IDataStore;

    constructor(dataStore: IDataStore) {
        this.dataStore = dataStore;
    }

    deleteTalent(id: number) {
        this.dataStore.deleteTalent(id);
    }
}

export default TalentController;