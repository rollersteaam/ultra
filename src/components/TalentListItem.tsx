import React, { useCallback } from "react";

import { Button } from 'reactstrap';
import { useDispatch } from 'react-redux';

import { Talent } from "../models/Talent";
import { startSession } from '../actions/timerActions';
import { deleteTalent } from '../actions/talentActions';

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
        <div className="Talent py-1">
            <span test-id="talentName">{props.talent.name}</span>
            <Button
                test-id={`talentListItem.${props.talent.id}.startTalent`} className="ml-2" color="success" onClick={startSessionMemo}>
                    Start
            </Button>
            <Button className="ml-2" color="danger" onClick={deleteTalentMemo}>Delete</Button>
        </div>
    )
}

export default TalentListItem;