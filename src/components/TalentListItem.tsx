import React, { Component, MouseEvent } from "react";

import { Button } from 'reactstrap';
import ITalentController from "../controllers/ITalentController";

export type TalentListItemProps = {
    id: number;
    name: string;
    talentController: ITalentController;
}

class TalentListItem extends Component<TalentListItemProps> {
    deleteTalent = (e: MouseEvent) => {
        this.props.talentController.deleteTalent(this.props.id);
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