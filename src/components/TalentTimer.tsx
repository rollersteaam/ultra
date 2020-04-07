import React, { useCallback } from 'react';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'reactstrap';

import { Talent } from '../models/Talent';
import { pollSession, stopSession } from '../actions/timerActions';
import { TalentSession } from '../models/TalentSession';

type TalentTimerProps = {
    talent: Talent | null,
    session: TalentSession | null
}

function TalentTimer(props: TalentTimerProps) {
    let timing = props.talent !== null && props.session !== null;

    const dispatch = useDispatch();
    const [ timer, setTimer ] = useState<NodeJS.Timeout>();

    if (timing && !timer) {
        setTimer(
            setInterval(() => {
                dispatch(pollSession())
            }, 200)
        );
    }

    if (!timing && timer) {
        clearInterval(timer);
        setTimer(undefined);
    }

    if (timing)
        return <TalentProgress talent={props.talent} />
    else
        return <TalentPlaceholder />
}

function TalentProgress(props: any) {
    const dispatch = useDispatch();
    const stop = useCallback((e: React.MouseEvent) => {
        dispatch(stopSession());
    }, [dispatch])

    return <div className="TalentTimer">
        <div test-id="talentTimer.talentName" className="title">
            {props.talent.name}
        </div>
        <span className="progress">
            {props.talent.progress}
        </span>
        <Button color="info" test-id="talentTimer.stop" onClick={stop}>Stop</Button>
    </div>
}

function TalentPlaceholder() {
    return <div>No talent selected.</div>
}

export default TalentTimer;