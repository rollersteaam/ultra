import React, { ReactElement } from 'react';
import ITalentController from "./ITalentController";
import Talent from '../models/Talent';
import IDataStore from '../stores/IDataStore';

type TalentControllerProps = {
    dataStore?: IDataStore;
}

class TalentController extends React.Component<TalentControllerProps> implements ITalentController {
    getTalents(): Talent[] {
        return this.props.dataStore!.getTalents();
    }

    deleteTalent(id: number) {
        this.props.dataStore!.deleteTalent(id);
    }

    render() {
        return React.cloneElement(this.props.children as ReactElement, {
            talentController: this
        });
    }
}

export default TalentController;