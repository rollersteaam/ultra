import React, { useEffect, useRef } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector, useDispatch } from 'react-redux';
import ReactGA from 'react-ga';

import './App.css';
import { RootState } from './store';
import TalentList from './components/TalentList';
import TalentTimer from './components/TalentTimer';
import { getTalents, calculateTalentProgression } from './actions/talentActions';
import Header from './components/Header';
import NewTalentButton from './components/NewTalentButton';
import { getSessions } from './actions/timerActions';
import UltraConsole from './components/UltraConsole';

function App(props: any) {
    const dispatch = useDispatch();
    const eco = useRef("");
    useEffect(() => {
        if (props.analytics) {
            ReactGA.initialize('UA-49256271-5');
            ReactGA.pageview('/talents');
        }

        dispatch(getTalents());
        dispatch(getSessions());
        dispatch(calculateTalentProgression());

        let tm = parseInt(localStorage.getItem("timemod") ?? "1");
        tm = JSON.parse(localStorage.getItem("chronobreak") ?? "false") ? tm : 1;
        let tickInterval = (30 * 60 * 1000) / tm;
        setInterval(() => {
            dispatch(getSessions());
            dispatch(calculateTalentProgression());
        }, tickInterval)

        document.addEventListener("keydown", (ev: KeyboardEvent) => {
            eco.current += ev.key;
            if (eco.current === "chronobreak") {
                ReactGA.event({
                    category: 'User',
                    action: 'Broke into Chronobreak'
                });

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
        <div className="App">
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