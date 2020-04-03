import React, { Component } from 'react';

import { Col } from 'reactstrap';

import TalentListItem from './TalentListItem';
import ITalentController from '../controllers/ITalentController';
import Talent from '../models/Talent';

type TalentListProps = {
    talents: Talent[];
    controller: ITalentController;
}

/**
 * A list of talents.
 */
class TalentList extends Component<TalentListProps> {
    render() {
        const talents = this.props.talents.map(
            talent => <TalentListItem
                key={talent.id}
                id={talent.id}
                name={talent.name}
                controller={this.props.controller}
            />
        );
        return (
            <Col>
                {talents}
            </Col>
        );
    }
}

export default TalentList;