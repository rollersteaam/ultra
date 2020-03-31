import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import { Talents } from './components/Talents';
import { TalentProps } from './components/Talent';


function App() {
    let talents: Array<TalentProps> = [
        {
            name: "Programming"
        },
        {
            name: "Music Creation"
        }
    ];
    return (
        <div className="App">
            <Talents talents={talents} />
        </div>
    );
}

export default App;