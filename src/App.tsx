import React, { useEffect, useRef } from 'react';

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
import { advanceTo } from 'jest-date-mock';
import { cGhostBlue } from './components/constants';
import UltraConsole from './components/UltraConsole';

function App() {
    const dispatch = useDispatch();
    const eco = useRef("");
    useEffect(() => {
        dispatch(getTalents());
        dispatch(getSessions());
        dispatch(calculateTalentProgression());

        document.addEventListener("keydown", (ev: KeyboardEvent) => {
            eco.current += ev.key;
            if (eco.current === "chronobreak") {
                let bVal: boolean = JSON.parse(localStorage.getItem("chronobreak") ?? "false");
                localStorage.setItem("chronobreak", `${!bVal}`);
                document.location.reload();
            }
        });
    }, [dispatch]);

    const state = useSelector((state: RootState) => state);
    const talents = state.talents.items;
    const { talent, session } = state.timer.session;
    const lastBeginsEditing = state.talents.lastBeginsEditing;

    return (
        <div className="App" style={{
            scrollbarColor: cGhostBlue
        }}>
            <Header />
            <TalentTimer talent={talent} session={session} />
            <TalentList talents={talents}
                lastBeginsEditing={lastBeginsEditing}
                />
            <NewTalentButton />
            <UltraConsole />
        </div>
    );
}

export default App;