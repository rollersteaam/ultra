import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector } from 'react-redux';

import './App.css';
import TalentList from './components/TalentList';
import NewTalentForm from './components/NewTalentForm';
import { RootState } from './store';

function App() {
    const state = useSelector((state: RootState) => state);
    const talents = state.talents.items;
    return (
        <div className="App">
            <TalentList talents={talents} />
            <NewTalentForm />
        </div>
    );
}

export default App;