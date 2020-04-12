import React, { useCallback, useState, useEffect, useRef } from "react";

import { Col, Row } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';

import { Talent } from "../models/Talent";
import { cMedBlue, bodyFont, centerCell, cGhostBlue } from './constants';
import Ultra from '../components/Ultra';
import TalentControls from './TalentControls';
import TalentRightClickMenu from './TalentRightClickMenu';
import { updateTalent } from "../actions/talentActions";
import { RootState } from "../store";

export type TalentListItemProps = {
    talent: Talent
    beginEditing?: boolean
}

function TalentListItem(props: TalentListItemProps) {
    const dispatch = useDispatch();

    let blockCancel = useRef(false);

    const [ editing, setEditing ] = useState(props.beginEditing);
    const enableEditing = useCallback(() => {
        setEditing(true);
        blockCancel.current = true;
        setTimeout(() => blockCancel.current = false, 100);
    }, [setEditing, blockCancel]);

    // Stop editing if focus is lost
    useEffect(() => {
        const handleDisableEditingOnDefocus = (e: any) => {
            let target: HTMLElement = e.target;

            if (blockCancel.current) return;

            if (target.id !== `talent-nameInput`) {
                setEditing(false);
            }
        }
        document.addEventListener("click", handleDisableEditingOnDefocus);
        return () => {
            document.removeEventListener("click", handleDisableEditingOnDefocus);
        }
    }, []);

    const [ rightClick, setRightClick ] = useState(false);
    const [ rightClickCoords, setRightClickCoords ] = useState({x: 0, y: 0});

    const openRightClickMenu = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setRightClick(true);
        setRightClickCoords({x: e.pageX, y: e.pageY});
    }, [setRightClick, setRightClickCoords]);

    // Close right click menu if focus is lost
    useEffect(() => {
        const handleCloseOnDefocus = (e: any) => {
            let target: HTMLElement = e.target;
            if (target.id !== `talent-${props.talent.id}-right-click-menu`) {
                setRightClick(false);
            }
        }
        document.addEventListener("click", handleCloseOnDefocus);
        return () => {
            document.removeEventListener("click", handleCloseOnDefocus);
        }
    }, [props.talent.id]);

    const progressDisplayValue = useCallback((id: number) => {
        let overflow = props.talent.goldUltras % 3;
        if (overflow === id)
            return props.talent.progress;
        if (overflow > id) return props.talent.progressTarget;
        return 0
    }, [props.talent]);
    const closeTargetDisplayValue = useCallback((id: number) => {
        if (props.talent.streakObtained) return 0;

        let overflow = props.talent.goldUltras % 3;
        if (overflow === id)
            return (props.talent.progress / props.talent.progressTarget) + 1 / 7;
        if (overflow > id) return props.talent.progressTarget;
        return 0
    }, [props.talent]);

    let background;
    if (editing) {
        background = cGhostBlue;
    } else if (props.talent.burndown) {
        background = "radial-gradient(circle at top left, rgba(255,201,22,1) 0%, rgba(255, 236, 172, 1) 100%)"
    } else if (props.talent.expiring) {
        background = "radial-gradient(circle at top left, rgba(255,74,152,1) 0%, rgba(255,201,22,1) 100%)"
    } else if (props.talent.streakObtained) {
        background = "radial-gradient(circle at top left, rgba(142,138,255,1) 0%, rgba(255,74,152,1) 100%)"
    } else {
        background = "radial-gradient(circle at top left, rgba(142,138,255,1) 0%, rgba(255,74,152,1) 50%, rgba(255,201,22,1) 100%)"
    }

    const [ name, setName ] = useState(props.talent.name);
    const onEditNameChange = useCallback((e: any) => {
        setName(e.target.value);
    }, [setName]);
    const onEditNameFinished = useCallback((e: any) => {
        e.preventDefault();
        props.talent.name = name;
        setEditing(false);
        dispatch(updateTalent(props.talent));
    }, [name, setEditing, props.talent, dispatch]);

    let sessions = useSelector((state: RootState) => state.timer.sessions);
    let talentSessions = sessions.filter(s => s.talentId === props.talent.id);
    let reset = new Date();
    reset.setHours(4, 0, 0, 0);
    let todaysSessions = talentSessions.filter(s => s.endTimestamp && s.endTimestamp.getTime() >= reset.getTime());
    let todaysProgress = todaysSessions.reduce((cur, next) => cur + next.progressObtained, 0);
    const todaysProgressDisplayValue = useCallback((id: number) => {
        let overflow = props.talent.goldUltras % 3;
        if (overflow === id)
            return todaysProgress
        return undefined
    }, [props.talent, todaysProgress]);

    return (
        <Row id={`talent-${props.talent.id}`}
            className="mb-4 mx-auto no-gutters"
            style={{
                maxWidth: "95vw",
                background: background,
                minHeight: "190px",
                borderRadius: "20px"
            }}
            onContextMenu={openRightClickMenu}>

            { rightClick ? 
                <TalentRightClickMenu
                    talent={props.talent}
                    edit={enableEditing}
                    x={rightClickCoords.x}
                    y={rightClickCoords.y}
                    />
            :
                <></>
            }

            <Col style={{...centerCell,
                maxWidth: "33.33%",
                minWidth: "450px"
                }}>
                { editing ?
                    <form onSubmit={onEditNameFinished} style={{
                        maxWidth: "100%"
                    }}>
                        <input id="talent-nameInput" style={{
                            ...bodyFont,
                            backgroundColor: "transparent",
                            border: "none",
                            color: cMedBlue,
                            fontSize: "3rem",
                            padding: "0",
                            textAlign: "center",
                            maxWidth: "100%"
                        }}
                        value={name}
                        onChange={onEditNameChange}
                        ></input>
                    </form>
                :
                    <div test-id="talentName" style={{
                        ...bodyFont,
                        color: "#FFF",
                        fontSize: "3rem",
                    }}>
                        {props.talent.name}
                    </div>
                }
            </Col>

            <Col style={{...centerCell,
                maxWidth: "33.33%",
                minWidth: "450px"
            }}>
                <Row>
                    <Col>
                        <Ultra progress={progressDisplayValue(0)}
                            progressTarget={props.talent.progressTarget}
                            background={editing ? cMedBlue : undefined}
                            backgroundOpacity="0.5"
                            closeTarget={closeTargetDisplayValue(0)}
                            todaysProgress={todaysProgressDisplayValue(0)}
                            />
                    </Col>
                    <Col>
                        <Ultra progress={progressDisplayValue(1)}
                            progressTarget={props.talent.progressTarget}
                            background={editing ? cMedBlue : undefined}
                            backgroundOpacity="0.5"
                            closeTarget={closeTargetDisplayValue(1)}
                            todaysProgress={todaysProgressDisplayValue(1)}
                            />
                    </Col>
                    <Col>
                        <Ultra progress={progressDisplayValue(2)}
                            progressTarget={props.talent.progressTarget}
                            background={editing ? cMedBlue : undefined}
                            backgroundOpacity="0.5"
                            closeTarget={closeTargetDisplayValue(2)}
                            todaysProgress={todaysProgressDisplayValue(2)}
                            />
                    </Col>
                </Row>
            </Col>

            <Col style={{...centerCell,
                maxWidth: "33.33%",
                minWidth: "450px"
            }}>
                <TalentControls talent={props.talent} ghost={editing ? true : undefined} />
            </Col>

        </Row>
    )
}

export default TalentListItem;