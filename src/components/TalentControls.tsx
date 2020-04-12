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

    // let minutes = props.talent.totalSeconds / 60;
    // minutes = Math.floor(minutes) % 60;
    // let seconds = Math.round(props.talent.totalSeconds) % 60;
    let hours = props.talent.totalSeconds / 3600;
    hours = Math.ceil(hours * 10) / 10;

    // let sm;
    // let ss;
    let sh;
    if (props.session) {
        // ss = Math.round(props.session.progressObtained) % 60;
        // sm = Math.floor(props.session.progressObtained / 60) % 60
        sh = Math.ceil(props.session.progressObtained / 3600 * 10) / 10;
    }

    return (
        <>

        <div style={{
            ...bodyFont,
            color: textColor,
            marginRight: "32px"
        }}>
            { props.session || props.placeholder ? 
                <div style={{
                    height: "78px",
                    display: "flex",
                    justifyContent: "right",
                }}>
                    <span style={{
                        fontSize: "1.5rem",
                        height: "30px",
                        margin: "auto 0",
                        marginRight: "8px"
                    }}>LV. </span>
                    <span style={{
                        fontSize: "3rem"
                    }}>
                        {props.talent.goldUltras}
                    </span>
                </div>
            :
                <div style={{
                    height: "110px",
                    display: "flex",
                    justifyContent: "right",
                }}>
                    <span style={{
                        fontSize: "2.5rem",
                        height: "40px",
                        margin: "auto 0",
                        marginRight: "8px"
                    }}>LV. </span>
                    <span style={{
                        fontSize: "4.5rem"
                    }}>
                        {props.talent.goldUltras}
                    </span>
                </div>
            }
            <div style={{
                display: "flex",
                justifyContent: "right",
                height: "5px"
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
                <>
                    <div style={{
                        fontSize: "3rem",
                        height: "52px"
                    }}>
                        {sh} hours
                    </div>
                    <div style={{
                        fontSize: "1rem",
                        textAlign: "right"
                    }}>
                        {hours} hours
                    </div>
                </>
            :
            props.placeholder ?
                <>
                    <div style={{
                        fontSize: "3rem",
                        height: "52px"
                    }}>
                        0 hours
                    </div>
                    <div style={{
                        fontSize: "1rem",
                        textAlign: "right"
                    }}>
                        {hours} hours
                    </div>
                </>
            :
                <div style={{
                    fontSize: "1.8rem",
                    marginTop: "12px",
                    marginBottom: "12px"
                }}>
                    {hours} hours
                </div>
            }
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