import React, { Component } from 'react';

import { Col } from 'reactstrap';

import TalentListItem from './TalentListItem';
import ITalentController from '../controllers/ITalentController';
import Talent from '../models/Talent';

type TalentListProps = {
    talents: Talent[]
    deleteTalent: (id: number) => any
}

/**
 * A list of talents.
 */
class TalentList extends Component<TalentListProps> {
    render() {
        const talentsData = this.props.talents;
        const talents = talentsData.map(
            talent => <TalentListItem
                key={talent.id}
                id={talent.id}
                name={talent.name}
                deleteTalent={this.props.deleteTalent}
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