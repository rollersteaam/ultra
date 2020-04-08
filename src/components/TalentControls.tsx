import React from 'react';
import { useCallback } from 'react';

import { useDispatch } from 'react-redux';
import { Button } from 'reactstrap';

import { Talent } from '../models/Talent';
import { TalentSession } from '../models/TalentSession';
import { bodyFont, cGhostBlue, cMedBlue } from './constants';
import { startSession } from '../actions/timerActions';
import { deleteTalent } from '../actions/talentActions';
import PlayToggleButton from './PlayToggleButton';

type TalentControlsProps = {
    talent: Talent,
    session?: TalentSession,
    placeholder?: boolean,
    ghost?: boolean
}

function TalentControls(props: TalentControlsProps) {
    const dispatch = useDispatch();
    
    const deleteTalentAction = useCallback(
        () => dispatch(deleteTalent(props.talent.id))
    , [dispatch, props.talent])

    let textColor: string;
    if (props.placeholder)
        textColor = cGhostBlue
    else if (props.ghost)
        textColor = cMedBlue
    else
        textColor = "#FFF";

    return (
        <>

        <div style={{
            ...bodyFont,
            color: textColor,
        }}>
            <div>
                <span style={{
                    fontSize: "1.5rem"
                }}>LV. </span>
                <span style={{
                    fontSize: "3rem"
                }}>
                    {props.talent.whiteStars}
                </span>
            </div>
            <div>
                {props.talent.streakCount}
            </div>
            <div>
                {props.talent.totalSeconds}
            </div>
        </div>

        <PlayToggleButton talent={props.talent}
            session={props.session}
            ghost={props.ghost}
            placeholder={props.placeholder}
            />
            
        </>
    )
}

export default TalentControls;