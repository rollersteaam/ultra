import React, { useCallback, useState, useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { ReactComponent as AddTalentButton } from '../assets/images/AddTalentButton.svg';
import { cGhostBlue, cMedBlue } from './constants';
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

    let [showHint, setShowHint] = useState(false);
    useEffect(() => {
        // if (localStorage.getItem("showHint") === null) {
        //     setShowHint(true);
        // }

        // localStorage.setItem("showHint", "false");

        // TODO: Change how hinting works in the future. For now, this will
        // remain always-on.
        setShowHint(true);
    }, []);

    return (
        <>
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
            { showHint ? 
                <div style={{
                    color: cMedBlue,
                    fontFamily: "Tw Cen MT",
                    fontSize: "1.5rem",
                    marginTop: "8px"
                }}>
                Right click talents to edit or delete them.
                </div>
            :
                <></>
            }
        </>
    )
}

export default NewTalentButton;