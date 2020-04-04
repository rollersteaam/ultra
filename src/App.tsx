import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector } from 'react-redux';

import './App.css';
import { RootState } from './store';
import TalentList from './components/TalentList';
import NewTalentForm from './components/NewTalentForm';
import TalentTimer from './components/TalentTimer';

function App() {
    const state = useSelector((state: RootState) => state);
    const talents = state.talents.items;
    const { timedTalent, timedSession } = state.timer.session;
    return (
        <div className="App">
            <TalentTimer talent={timedTalent} session={timedSession} />
            <TalentList talents={talents} />
            <NewTalentForm />
        </div>
    );
}

export default App;