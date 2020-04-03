import ITalentController from "./ITalentController";
import IDataStore from '../stores/IDataStore';

class TalentController implements ITalentController {
    private dataStore: IDataStore;

    constructor(dataStore: IDataStore) {
        this.dataStore = dataStore;
    }

    createTalent(name: string) {
        this.dataStore.createTalent(name);
    }

    deleteTalent(id: number) {
        this.dataStore.deleteTalent(id);
    }
}

export default TalentController;