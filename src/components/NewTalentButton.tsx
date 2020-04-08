import React, { useCallback } from 'react';

import { useDispatch } from 'react-redux';
import { cGhostBlue } from './constants';
import { ReactComponent as AddTalentButton } from '../assets/images/AddTalentButton.svg';
import { newTalent } from '../actions/talentActions';

function NewTalentButton() {
    const dispatch = useDispatch();

    const newTalentAction = useCallback(() => {
        dispatch(newTalent("Your New Talent"));
    }, [dispatch])

    return (
        <div className="p-2 mx-auto"
        style={{
            width: "25vw",
            backgroundColor: cGhostBlue,
            borderRadius: "41px",
            cursor: "pointer"
        }}
        onClick={newTalentAction}>
            <AddTalentButton height="30px" />
        </div>
    )
}

export default NewTalentButton;