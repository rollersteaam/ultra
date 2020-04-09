import React, { useCallback, useState, useEffect, useRef } from "react";

import { Col, Row } from 'reactstrap';
import { useDispatch } from 'react-redux';

import { Talent } from "../models/Talent";
import { cMedBlue, bodyFont, centerCell, cGhostBlue } from './constants';
import Ultra from '../components/Ultra';
import TalentControls from './TalentControls';
import TalentRightClickMenu from './TalentRightClickMenu';
import { updateTalent } from "../actions/talentActions";

export type TalentListItemProps = {
    talent: Talent;
}

function TalentListItem(props: TalentListItemProps) {
    const dispatch = useDispatch();

    let blockCancel = useRef(false);

    const [ editing, setEditing ] = useState(false);
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

    const progressDisplayValue = (id: number) => {
        let overflow = props.talent.whiteStars % 3;
        if (overflow === id) return props.talent.progress;
        if (overflow > id) return props.talent.progressTarget;
        return 0
    };

    let background = editing ?
        cGhostBlue
        :
        "radial-gradient(circle at top left, rgba(142,138,255,1) 0%, rgba(255,74,152,1) 100%)";

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

    return (
        <Row id={`talent-${props.talent.id}`}
            className="mb-3 mx-auto no-gutters"
            style={{
                maxWidth: "95vw",
                background: background,
                minHeight: "20vh",
                maxHeight: "20vh",
                borderRadius: "20px",
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
                maxWidth: "33.33%"
                }}>
                { editing ?
                    <form onSubmit={onEditNameFinished}>
                        <input id="talent-nameInput" style={{
                            ...bodyFont,
                            backgroundColor: "transparent",
                            border: "none",
                            color: cMedBlue,
                            fontSize: "3rem",
                            padding: "0"
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
                maxWidth: "33.33%"
            }}>
                <Row>
                    <Col>
                        <Ultra progress={progressDisplayValue(0)}
                            progressTarget={props.talent.progressTarget}
                            background={editing ? cMedBlue : undefined}
                            backgroundOpacity="0.5"
                            />
                    </Col>
                    <Col>
                        <Ultra progress={progressDisplayValue(1)}
                            progressTarget={props.talent.progressTarget}
                            background={editing ? cMedBlue : undefined}
                            backgroundOpacity="0.5"
                            />
                    </Col>
                    <Col>
                        <Ultra progress={progressDisplayValue(2)}
                            progressTarget={props.talent.progressTarget}
                            background={editing ? cMedBlue : undefined}
                            backgroundOpacity="0.5"
                            />
                    </Col>
                </Row>
            </Col>

            <Col style={{...centerCell,
                maxWidth: "33.33%"
            }}>
                <TalentControls talent={props.talent} ghost={editing ? true : undefined} />
            </Col>

        </Row>
    )
}

export default TalentListItem;