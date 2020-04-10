import React, { useEffect } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector, useDispatch } from 'react-redux';

import './App.css';
import { RootState } from './store';
import TalentList from './components/TalentList';
import TalentTimer from './components/TalentTimer';
import { getTalents, calculateTalentProgression } from './actions/talentActions';
import Header from './components/Header';
import NewTalentButton from './components/NewTalentButton';
import { getSessions } from './actions/timerActions';

function App() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getTalents());
        dispatch(getSessions());
        dispatch(calculateTalentProgression());
    }, [dispatch]);

    const state = useSelector((state: RootState) => state);
    const talents = state.talents.items;
    const { talent, session } = state.timer.session;
    const lastBeginsEditing = state.talents.lastBeginsEditing;
    return (
        <div className="App">
            <Header />
            <TalentTimer talent={talent} session={session} />
            <TalentList talents={talents}
                lastBeginsEditing={lastBeginsEditing}
                />
            <NewTalentButton />
        </div>
    );
}

export default App;