import React from 'react';

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
function TalentList(props: TalentListProps) {
    const talents = props.talents.map(
        talent => <TalentListItem
            key={talent.id}
            id={talent.id}
            name={talent.name}
            controller={props.controller}
        />
    );
    return (
        <Col>
            {talents}
        </Col>
    );
}

export default TalentList;