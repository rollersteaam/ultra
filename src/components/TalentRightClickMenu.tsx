import React, { useEffect, useCallback, useState } from 'react';

import { Row, Col } from 'reactstrap';
import { useDispatch } from 'react-redux';

import { ReactComponent as EditIcon } from '../assets/images/EditIcon.svg';
import { ReactComponent as DeleteIcon } from '../assets/images/DeleteIcon.svg';
import { centerCell } from './constants';
import { deleteTalent } from '../actions/talentActions';


function TalentRightClickMenu(props: any) {
    const dispatch = useDispatch();
    const editAction = useCallback(() => {
        // Ignored, not implemented yet
    }, []);
    const deleteAction = useCallback(() => {
        dispatch(deleteTalent(props.talent.id));
    }, [dispatch]);

    return (
        <div id="talent-right-click-menu" style={{
            position: "absolute",
            top: props.y,
            left: props.x,
            height: "252px",
            width: "209px",
            boxShadow: "3px 3px 6px 0px rgba(0, 0, 0, 0.16)",
            backgroundColor: "#FFF",
            zIndex: 50,
            borderRadius: "20px",
        }}>
            <MenuItem icon={EditIcon} text="Edit" click={editAction} style={{
                marginTop: "0.9rem"
            }} />
            <MenuItem icon={DeleteIcon} text="Delete" click={deleteAction} />
        </div>
    )
}

function MenuItem(props: any) {
    const [ hovering, setHovering ] = useState(false);
    const mouseEnter = useCallback(() => {
        setHovering(true);
    }, []);
    const mouseLeave = useCallback(() => {
        setHovering(false);
    }, []);
    return (
        <Row className="mx-auto p-2 no-gutters"
        style={{
            fontFamily: "Tw Cen MT",
            fontSize: "1.5rem",
            color: "#757575",
            backgroundColor: hovering ? "rgba(215, 214, 255, 0.28)" : "transparent",
            borderRadius: "21px",
            maxWidth: "91%",
            ...props.style
        }}
        onMouseEnter={mouseEnter}
        onMouseLeave={mouseLeave}
        onMouseDown={props.click}>
            <Col style={{
                ...centerCell,
                maxWidth: "25%"
                }}>
                <props.icon height="18px" />
            </Col>
            <Col style={{...centerCell,
                justifyContent: "left"}}>
                {props.text}
            </Col>
        </Row>
    )
}

export default TalentRightClickMenu;