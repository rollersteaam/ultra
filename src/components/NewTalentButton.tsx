import React, { useCallback, useRef, useState } from 'react';

import { useDispatch } from 'react-redux';
import { cGhostBlue } from './constants';
import { ReactComponent as AddTalentButton } from '../assets/images/AddTalentButton.svg';
import { newTalent } from '../actions/talentActions';

function NewTalentButton() {
    const dispatch = useDispatch();
    
    const [opening, setOpening] = useState(false);
    const newTalentAction = useCallback(() => {
        setOpening(true);
        setTimeout(() => {
            window.scrollTo(0, window.outerHeight);
        }, 150);
        setTimeout(() => {
            setOpening(false);
            dispatch(newTalent("Your New Talent"));
        }, 300);
    }, [dispatch, setOpening])

    const conditionalAnimation = opening ? {
        transitionDuration: "300ms",
        transitionTimingFunction: "ease-out"
    } : {}

    return (
        <div id="new-talent-button"
        className="p-2 mx-auto"
        style={{
            width: opening ? "95vw" : "25vw",
            height: opening ? "190px" : "46px",
            backgroundColor: cGhostBlue,
            borderRadius: "41px",
            cursor: "pointer",
            ...conditionalAnimation
        }}
        onClick={newTalentAction}>
            { opening ?
                <></>
            :
                <AddTalentButton height="30px" />
            }
        </div>
    )
}

export default NewTalentButton;