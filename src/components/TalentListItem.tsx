import React, { useCallback } from "react";

import { Button, Col, Row } from 'reactstrap';
import { useDispatch } from 'react-redux';

import { Talent } from "../models/Talent";
import { startSession } from '../actions/timerActions';
import { deleteTalent } from '../actions/talentActions';
import { medBlue, bodyFont } from './constants';
import { ReactComponent as PlayButton } from '../assets/images/PlayButton.svg';

export type TalentListItemProps = {
    talent: Talent;
}

function TalentListItem(props: TalentListItemProps) {
    const dispatch = useDispatch();
    const deleteTalentMemo = useCallback(
        () => dispatch(deleteTalent(props.talent.id)),
        [dispatch, props.talent]
    );
    const startSessionMemo = useCallback(
        () => dispatch(startSession(props.talent)),
        [dispatch, props.talent]
    );
    return (
        <Row className="mb-3 p-5 mx-auto" style={{
            maxWidth: "95vw",
            maxHeight: "20vh",
            background: "radial-gradient(circle at top left, rgba(142,138,255,1) 0%, rgba(255,74,152,1) 100%)",
            borderRadius: "20px",
        }}>
            <Col>
                <span test-id="talentName" style={{
                    ...bodyFont,
                    color: "#FFF",
                    fontSize: "3rem"
                }}>
                    {props.talent.name}
                </span>
            </Col>
            <Col>
            </Col>
            <Col>
                {/* <Button
                    test-id={`talentListItem.${props.talent.id}.startTalent`} className="ml-2" color="success" onClick={startSessionMemo}>
                        Start
                </Button> */}
                <PlayButton
                    test-id={`talentListItem.${props.talent.id}.startTalent`} 
                    className="ml-2"
                    color="success" 
                    onClick={startSessionMemo}
                    style={{
                        cursor: "pointer"
                    }}
                    />
                {/* <Button className="ml-2" color="danger" onClick={deleteTalentMemo}>Delete</Button> */}
            </Col>
        </Row>
    )
}

export default TalentListItem;