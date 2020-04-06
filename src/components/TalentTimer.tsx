import React from 'react';

import { Talent } from '../models/Talent';
import { useState } from 'react';
import TalentSession from '../models/TalentSession';

type TalentTimerProps = {
    talent: Talent | null,
    session: TalentSession | null
}

function TalentTimer(props: TalentTimerProps) {
    if (props.talent === null || props.session === null)
        return <div>No talent selected.</div>
    
    return <div className="TalentTimer">
        <div test-id="talentTimer.talentName" className="title">
            {props.talent.name}
        </div>
        <span className="progress">
            {props.talent.progress}
        </span>
    </div>
}

export default TalentTimer;