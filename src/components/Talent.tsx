import React, { Component } from "react";


export type TalentProps = {
    name: string
}

export class Talent extends Component<TalentProps> {
    constructor(props: TalentProps) {
        super(props);
    }

    render() {
        return (
            <div className="Talent">
                {this.props.name}
            </div>
        )
    }
}

export default Talent;