import React, { ReactElement } from 'react';
import ITalentController from "./ITalentController";
import Talent from '../models/Talent';
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