import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import TalentList from './components/TalentList';
import ITalentController from './controllers/ITalentController';
import TalentController from './controllers/TalentController';
import IDataStore from './stores/IDataStore';
import DataStore from './stores/DataStore';
import Talent from './models/Talent';

export type AppState = {
    talents: Talent[]
}

class App extends React.Component<Object, AppState> {
    private dataStore: IDataStore;
    private talentController: ITalentController;

    constructor(props: any) {
        super(props);
        
        this.dataStore = new DataStore((state) => this.setState(state));
        this.talentController = new TalentController(this.dataStore);
        
        this.state = this.dataStore.getInitialDataCopy();
    }

    render() {
        return (
        <div className="App">
            <TalentList talents={this.state.talents} controller={this.talentController} />
        </div>
        );
    }
}

export default App;