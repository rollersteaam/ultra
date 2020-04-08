import React, { useCallback } from 'react';

import { useDispatch } from 'react-redux';

import { TalentSession } from '../models/TalentSession';
import { Talent } from '../models/Talent';
import { cGhostBlue } from './constants';
import { startSession, stopSession } from '../actions/timerActions';
import { ReactComponent as PlayButton } from '../assets/images/PlayButton.svg';
import { ReactComponent as StopButton } from '../assets/images/StopButton.svg';

type PlayToggleButtonProps = {
    talent?: Talent,
    session?: TalentSession,
    ghost?: boolean,
    placeholder?: boolean
}

function PlayToggleButton(props: PlayToggleButtonProps) {
    const dispatch = useDispatch();
    const startSessionAction = useCallback(
        () => {
            if (props.talent)
                dispatch(startSession(props.talent))
        }
    , [dispatch, props.talent])
    const stopSessionAction = useCallback((e: React.MouseEvent) => {
        dispatch(stopSession());
    }, [dispatch])
    
    if (props.ghost)
        return <></>

    if (props.placeholder)
        return <StopButton
            test-id="talentTimer.stop"
            fill={cGhostBlue}
            />

    if (props.session)
        return <StopButton
            test-id="talentTimer.stop"
            onClick={stopSessionAction}
            fill="#FFF"
            style={{
                cursor: "pointer"
            }}
            />
    
    return <PlayButton
        test-id={`talentListItem.${props.talent ? props.talent.id : 0}.startTalent`} 
        color="success" 
        onClick={startSessionAction}
        style={{
            cursor: "pointer"
        }}
        />
}

export default PlayToggleButton;