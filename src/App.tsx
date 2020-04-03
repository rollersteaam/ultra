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
        
        // Bind data store to the app state
        this.dataStore = new DataStore((state) => this.setState(state));
        this.state = this.dataStore.getInitialDataCopy();

        this.talentController = new TalentController(this.dataStore);

        // Make components read dependent upon app state
        // Supply update commands via 'controller' reference from constructor
        // Initialize data store and talent controller through DI in constructor

        // Scalable architecture created?
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