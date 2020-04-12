import React, { useCallback, useRef, useEffect } from 'react';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col } from 'reactstrap';

import { Talent, createTalent } from '../models/Talent';
import { pollSession } from '../actions/timerActions';
import { TalentSession } from '../models/TalentSession';
import { medBlue, bodyFont, centerCell } from './constants';
import Ultra from '../components/Ultra';
import TalentControls from './TalentControls';
import { RootState } from '../store';

type TalentTimerProps = {
    talent: Talent | null,
    session: TalentSession | null
}

function TalentTimer(props: TalentTimerProps) {
    let timing = props.talent !== null && props.session !== null;

    const dispatch = useDispatch();
    const [ timer, setTimer ] = useState(0);

    if (timing && !timer) {
        setTimer(
            setInterval(() => {
                dispatch(pollSession())
            }, 200)
        );
    }

    if (!timing && timer) {
        clearInterval(timer);
        setTimer(0);
    }

    if (timing)
        return <TalentProgress talent={props.talent!} session={props.session!} />
    else
        return <TalentPlaceholder />
}

type TalentProgressProps  = {
    talent: Talent,
    session: TalentSession
}

function TalentProgress(props: TalentProgressProps) {
    const progressDisplayValue = useCallback((id: number) => {
        let overflow = props.talent.goldUltras % 3;
        if (overflow === id) {
            if (props.talent.streakObtained) {
                return props.talent.progress;
            } else {
                return props.talent.progress + props.session.progressObtained * 11;
            }
        }
        if (overflow > id) return props.talent.progressTarget;
        return 0
    }, [props.talent, props.session]);

    const closeTargetDisplayValue = useCallback((id: number) => {
        if (props.talent.streakObtained) return 0;

        let overflow = props.talent.goldUltras % 3;
        if (overflow === id)
            return (props.talent.progress / props.talent.progressTarget) + 1 / 7;
        if (overflow > id) return props.talent.progressTarget;
        return 0
    }, [props.talent]);

    const beingTimed = useCallback((id: number) => {
        let overflow = props.talent.goldUltras % 3;
        if (overflow === id)
            return true;
        return false;
    }, [props.talent]);

    let background = props.talent.streakObtained ?
        "radial-gradient(circle at top left, rgba(142,138,255,1) 0%, rgba(69,62,255,1) 75%, rgba(69,62,255,1) 100%)"
        :
        "radial-gradient(circle at top left, rgba(142,138,255,1) 0%, rgba(255,74,152,1) 50%, rgba(255,201,22,1) 100%)"

    let sessions = useSelector((state: RootState) => state.timer.sessions);
    let [todaysProgress, setTodaysProgress] = useState(0);
    useEffect(() => {
        let talentSessions = sessions.filter(s => s.talentId === props.talent.id);
        let reset = new Date();
        reset.setHours(4, 0, 0, 0);
        let todaysSessions = talentSessions.filter(s => s.endTimestamp && s.endTimestamp.getTime() >= reset.getTime());
        setTodaysProgress(todaysSessions.reduce((cur, next) => cur + next.progressObtained, 0));
    }, [sessions, props.talent.id])
    const todaysProgressDisplayValue = useCallback((id: number) => {
        let overflow = props.talent.goldUltras % 3;
        if (overflow === id)
            return todaysProgress
        return undefined
    }, [props.talent, todaysProgress]);

    return (
        <Row className="mb-3 mx-auto no-gutters" style={{
            maxWidth: "95vw",
            minHeight: "190px",
            borderRadius: "20px",
            background: background
        }}>
            <Col style={{...centerCell}}>
                <div test-id="talentTimer.talentName" className="title"
                    style={{...bodyFont,
                        color: "#FFF",
                        fontSize: "3rem"}}>
                    {props.talent.name}
                </div>
            </Col>
            <Col style={{...centerCell}}>
                <Row>
                    <Col>
                        <Ultra progress={progressDisplayValue(0)}
                            progressTarget={props.talent.progressTarget}
                            todaysProgress={todaysProgressDisplayValue(0)}
                            backgroundOpacity="1"
                            closeTarget={closeTargetDisplayValue(0)}
                            beingTimed={beingTimed(0)}
                            />
                    </Col>
                    <Col>
                        <Ultra progress={progressDisplayValue(1)}
                            progressTarget={props.talent.progressTarget}
                            todaysProgress={todaysProgressDisplayValue(1)}
                            backgroundOpacity="1"
                            closeTarget={closeTargetDisplayValue(1)}
                            beingTimed={beingTimed(1)}
                            />
                    </Col>
                    <Col>
                        <Ultra progress={progressDisplayValue(2)}
                            progressTarget={props.talent.progressTarget}
                            todaysProgress={todaysProgressDisplayValue(2)}
                            backgroundOpacity="1"
                            closeTarget={closeTargetDisplayValue(2)}
                            beingTimed={beingTimed(2)}
                            />
                    </Col>
                </Row>
            </Col>
            <Col style={{...centerCell}}>
                <TalentControls talent={props.talent} session={props.session} />
            </Col>
        </Row>
    )
}

const dummyTalent = createTalent(0, "Start a talent to begin earning ultra.", 7, 0, 1, 0, 0, 0);

function TalentPlaceholder() {
    return (
        <Row className="mb-4 mx-auto no-gutters" style={{
            maxWidth: "95vw",
            minHeight: "190px",
            borderStyle: "dashed",
            borderColor: "#D7D6FF",
            borderWidth: "7px",
            borderRadius: "20px"
        }}>
            <Col style={{
                ...bodyFont,
                ...medBlue,
                ...centerCell,
                fontSize: "3rem",
                width: "60%",
            }}>
                Start a talent to begin earning ultra.
            </Col>
            <Col style={{...centerCell}}>
                <Row>
                    <Col>
                        <Ultra progress={0}
                            progressTarget={1}
                            />
                    </Col>
                    <Col>
                        <Ultra progress={0}
                            progressTarget={1}
                            />
                    </Col>
                    <Col>
                        <Ultra progress={0}
                            progressTarget={1}
                            />
                    </Col>
                </Row>
            </Col>
            <Col style={{...centerCell}}>
                <TalentControls talent={dummyTalent} placeholder />
            </Col>
        </Row>
    )
}

export default TalentTimer;