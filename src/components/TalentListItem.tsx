import React from "react";

import { Button } from 'reactstrap';

import ITalentController from "../controllers/ITalentController";

export type TalentListItemProps = {
    id: number;
    name: string;
    controller: ITalentController;
}

function TalentListItem(props: TalentListItemProps) {
    const deleteTalent = (...args: any[]) => {
        props.controller.deleteTalent(props.id);
    }

    return (
        <div className="Talent py-1">
            {props.name}
            <Button className="ml-3" color="danger" onClick={deleteTalent}>Delete</Button>
        </div>
    )
}

export default TalentListItem;