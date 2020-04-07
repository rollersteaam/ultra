import React, { useEffect } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector, useDispatch } from 'react-redux';

import './App.css';
import { RootState } from './store';
import TalentList from './components/TalentList';
import NewTalentForm from './components/NewTalentForm';
import TalentTimer from './components/TalentTimer';
import { getTalents } from './actions/talentActions';
import Header from './components/Header';

function App() {
    const dispatch = useDispatch();
    useEffect(() => { dispatch(getTalents()) }, [dispatch]);

    const state = useSelector((state: RootState) => state);
    const talents = state.talents.items;
    const { talent, session } = state.timer.session;
    return (
        <div className="App">
            <Header />
            <TalentTimer talent={talent} session={session} />
            <TalentList talents={talents} />
            <NewTalentForm />
        </div>
    );
}

export default App;