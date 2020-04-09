import React from 'react';

import TalentListItem from './TalentListItem';
import { Talent } from '../models/Talent';

type TalentListProps = {
    talents: Talent[]
}

/**
 * A list of talents.
 */
function TalentList(props: TalentListProps) {
    const talents = props.talents.map(
        talent => <TalentListItem
            key={talent.id}
            talent={talent}
        />
    );
    return (
        <>
        {talents}
        </>
    );
}

export default TalentList;