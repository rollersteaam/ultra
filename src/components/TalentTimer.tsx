import React, { useCallback } from 'react';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Row, Col } from 'reactstrap';

import { Talent } from '../models/Talent';
import { pollSession, stopSession } from '../actions/timerActions';
import { TalentSession } from '../models/TalentSession';
import { medBlue, bodyFont } from './constants';
import { ReactComponent as StopButton } from '../assets/images/StopButton.svg';

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
        return <TalentProgress talent={props.talent!} />
    else
        return <TalentPlaceholder />
}

type TalentProgressProps  = {
    talent: Talent
}

function TalentProgress(props: TalentProgressProps) {
    const dispatch = useDispatch();
    const stop = useCallback((e: React.MouseEvent) => {
        dispatch(stopSession());
    }, [dispatch])

    return (
        <Row className="mb-3 p-5 mx-auto" style={{
            maxWidth: "95vw",
            maxHeight: "20vh",
            borderRadius: "20px",
            background: "radial-gradient(circle at top left, rgba(142,138,255,1) 0%, rgba(69,62,255,1) 75%, rgba(69,62,255,1) 100%)",
        }}>
            <Col>
                <div test-id="talentTimer.talentName" className="title"
                    style={{...bodyFont,
                        color: "#FFF",
                        fontSize: "3rem"}}>
                    {props.talent.name}
                </div>
            </Col>
            <Col>
                <div style={{...bodyFont,
                    color: "#FFF",
                    fontSize: "3rem"}}>
                    {(props.talent.progress / props.talent.progressTarget) * 100}%
                </div>
            </Col>
            <Col>
                <StopButton
                    test-id="talentTimer.stop"
                    onClick={stop}
                    style={{
                        cursor: "pointer"
                    }}
                    />
                {/* <Button color="info" test-id="talentTimer.stop" onClick={stop}>Stop</Button> */}
            </Col>
        </Row>
    )
}

function TalentPlaceholder() {
    return (
        <div className="mb-3 p-5 mx-auto" style={{
            maxWidth: "95vw",
            maxHeight: "20vh",
            borderStyle: "dashed",
            borderColor: "#D7D6FF",
            borderWidth: "5px",
            borderRadius: "20px",
        }}>
            <span style={{...bodyFont,
                ...medBlue,
                fontSize: "3rem"}}>
            Start a talent to begin earning ultra.
            </span>
        </div>
    )
}

export default TalentTimer;