import { Talent } from '../models/Talent';
import { useState } from 'react';

type TalentTimerProps = {
    talent: Talent
}

function TalentTimer(props: TalentTimerProps) {
    const [ elapsed, setElapsed ] = useState(0);

    return <div className="TalentTimer">
        <div className="title">
            {props.talent.name}
        </div>
        <span className="progress">
            {props.talent.progress}
        </span>

    </div>
}

export default TalentTimer;