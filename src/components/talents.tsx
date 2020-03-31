import React, { Component } from 'react';

import { Col } from 'reactstrap';

import { Talent, TalentProps } from './Talent';


type TalentsProps = {
    talents: Array<TalentProps>
}

type TalentsState = {}

/**
 * A list of talents.
 */
export class Talents extends Component<TalentsProps, TalentsState> {
    constructor(props: TalentsProps) {
        super(props);
    }

    render() {
        return (
            <Col>
            {this.props.talents.map(
                talent => <Talent name={talent.name} />
            )}
            </Col>
        );
    }
}