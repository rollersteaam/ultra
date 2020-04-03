import React, { Component } from 'react';

import { Col } from 'reactstrap';

import TalentListItem from './TalentListItem';
import ITalentController from '../controllers/ITalentController';

type TalentListProps = {
    talentController?: ITalentController
}

/**
 * A list of talents.
 */
class TalentList extends Component<TalentListProps> {
    render() {
        const talentsData = this.props.talentController!.getTalents();
        const talents = talentsData.map(
            talent => <TalentListItem
                key={talent.id}
                id={talent.id}
                name={talent.name}
                talentController={this.props.talentController!}
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