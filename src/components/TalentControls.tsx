import React from 'react';

import { Talent } from '../models/Talent';
import { TalentSession } from '../models/TalentSession';
import { centerCell, bodyFont, cGhostBlue, cMedBlue } from './constants';
import PlayToggleButton from './PlayToggleButton';

type TalentControlsProps = {
    talent: Talent,
    session?: TalentSession,
    placeholder?: boolean,
    ghost?: boolean
}

function TalentControls(props: TalentControlsProps) {
    let textColor: string;
    if (props.placeholder)
        textColor = cGhostBlue
    else if (props.ghost)
        textColor = cMedBlue
    else
        textColor = "#FFF";

    let minutes = props.talent.totalSeconds / 60;
    let hours = props.talent.totalSeconds / 3600;
    hours = Math.floor(hours * 10) / 10;
    minutes = Math.floor(minutes) % 60;
    let seconds = Math.round(props.talent.totalSeconds) % 60;

    let sm;
    let sh;
    let ss;
    if (props.session) {
        ss = Math.round(props.session.progressObtained) % 60;
        sm = Math.floor(props.session.progressObtained / 60) % 60
        sh = Math.floor(props.session.progressObtained / 3600);
    }

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
                    {props.talent.goldUltras}
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
                }}><span role="img" aria-label="Streak">🔥</span> </div>
                <div style={{
                    ...centerCell,
                    fontSize: "2.8rem",
                }}>{props.talent.streakCount}</div>
            </div>
            { props.session ? 
                <div style={{
                    fontSize: "1.5rem"
                }}>
                    {sh} hours, {sm} minutes, {ss} seconds
                </div>
            :
                <></>
            }
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