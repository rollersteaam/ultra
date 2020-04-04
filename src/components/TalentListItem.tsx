import React, { useCallback } from "react";

import { Button } from 'reactstrap';
import { useDispatch } from 'react-redux';

import { DELETE_TALENT } from "../actions/types";
import { Talent } from "../models/Talent";

export type TalentListItemProps = {
    talent: Talent;
}

function TalentListItem(props: TalentListItemProps) {
    const dispatch = useDispatch();
    const deleteTalent = useCallback(
        () => dispatch({ type: DELETE_TALENT, payload: props.talent.id }),
        [dispatch, props.talent.id]
    );
    return (
        <div className="Talent py-1">
            {props.talent.name}
            <Button className="ml-3" color="danger" onClick={deleteTalent}>Delete</Button>
        </div>
    )
}

export default TalentListItem;