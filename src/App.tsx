import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import TalentList from './components/TalentList';
import ITalentController from './controllers/ITalentController';
import TalentController from './controllers/TalentController';
import IDataStore from './stores/IDataStore';
import DataStore from './stores/DataStore';


type AppState = {
    talentController: ITalentController;
    dataStore: IDataStore;
}

class App extends React.Component<Object, AppState> {
    render() {
        return (
        <div className="App">
            <DataStore>
                <TalentController>
                    <TalentList />
                </TalentController>
            </DataStore>
        </div>
        );
    }
}

export default App;