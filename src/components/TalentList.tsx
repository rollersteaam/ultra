import React from 'react';

import TalentListItem from './TalentListItem';
import { Talent } from '../models/Talent';

type TalentListProps = {
    talents: Talent[]
    lastBeginsEditing?: boolean
}

/**
 * A list of talents.
 */
function TalentList(props: TalentListProps) {
    const talents = props.talents.map(
        (talent, i, arr) => <TalentListItem
            key={talent.id}
            talent={talent}
            beginEditing={props.lastBeginsEditing && i === arr.length - 1}
        />
    );
    return (
        <>
        {talents}
        </>
    );
}

export default TalentList;