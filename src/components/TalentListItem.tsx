import React, { Component } from "react";

import { Button } from 'reactstrap';

import ITalentController from "../controllers/ITalentController";

export type TalentListItemProps = {
    id: number;
    name: string;
    controller: ITalentController;
}

class TalentListItem extends Component<TalentListItemProps> {
    deleteTalent = (...args: any[]) => {
        this.props.controller.deleteTalent(this.props.id);
    }

    render() {
        return (
            <div className="Talent">
                {this.props.name}
                <Button className="ml-3" color="danger" onClick={this.deleteTalent}>Delete</Button>
            </div>
        )
    }
}

export default TalentListItem;