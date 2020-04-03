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
    private talentController: ITalentController;

    constructor(props: any) {
        super(props);
        this.state = {
            talents: [
                {
                    id: 0,
                    name: "Example Talent 1"
                },
                {
                    id: 1,
                    name: "Example Talent 2"
                },
                {
                    id: 2,
                    name: "Example Talent 3"
                }
            ]
        };
        this.talentController = new TalentController({});
    }

    reflect = (fn: Function) => {
        return (...args: any[]) => {
            this.setState(fn(this.state, ...args));
        }
    }

    render() {
        return (
        <div className="App">
            <TalentList
                talents={this.state.talents}
                deleteTalent={this.reflect(this.talentController.deleteTalent)}
            />
        </div>
        );
    }
}

export default App;