import React, { Component } from 'react';

type TalentsProps = {}

/**
 * A list of talents.
 */
export class Talents extends Component<TalentsProps> {
    constructor(props: TalentsProps) {
        super(props);
        this.state = {};
    }

    render() {
        return <div><p>Hello world.</p></div>
    }
}