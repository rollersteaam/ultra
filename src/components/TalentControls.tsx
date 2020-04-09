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
import { centerCell } from './constants';

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

    let talentTimespan = new Date(props.talent.totalSeconds);
    let minutes = props.talent.totalSeconds / 60;
    let hours = props.talent.totalSeconds / 3600;
    hours = Math.round(hours * 10) / 10;
    minutes = Math.round(minutes);
    let seconds = Math.round(props.talent.totalSeconds) % 60;

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
            <div style={{
                display: "flex",
                justifyContent: "center"
            }}>
                <div style={{
                    ...centerCell,
                    fontSize: "2rem",
                    mixBlendMode: props.ghost || props.placeholder ?
                        "exclusion" : "normal"
                }}>🔥 </div>
                <div style={{
                    ...centerCell,
                    fontSize: "2.8rem",
                }}>{props.talent.streakCount}</div>
            </div>
            <div style={{
                fontSize: "1.5rem"
            }}>
                {hours} hours, {minutes} minutes, {seconds} seconds
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