import React, { ReactElement } from "react";

import IDataStore from "./IDataStore";
import Talent from "../models/Talent";

export type DataStoreState = {
    talents : Talent[];
}

export type DataStoreProps = {}

class DataStore extends React.Component<DataStoreProps, DataStoreState> implements IDataStore {
    constructor(props: DataStoreProps) {
        super(props);
        this.state = {
            talents: [
                {
                    id: 0,
                    name: "Programming"
                },
                {
                    id: 1,
                    name: "Music Creation"
                },
                {
                    id: 2,
                    name: "Apricots"
                },
                {
                    id: 3,
                    name: "Pineapples"
                }
            ]
        }
    }

    deleteTalent = (id: number) => {
        var newTalents = this.state.talents.filter(
            talent => talent.id !== id
        )
        this.setState({...this.state, talents: newTalents});
    }

    getTalents = (): Talent[] => this.state.talents;

    render() {
        return React.cloneElement(this.props.children as ReactElement, {
            dataStore: this
        });
    }
}

export default DataStore;