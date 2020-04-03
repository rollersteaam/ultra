import IDataStore from "./IDataStore";
import { AppState } from "../App";

class DataStore implements IDataStore {
    private state: Readonly<AppState>;
    private setStateFunction: (state: AppState) => void;

    constructor(setStateFunction: (state: AppState) => void) {
        this.setStateFunction = setStateFunction;
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
    
    setState(state: AppState) {
        this.state = state;
        this.setStateFunction(state);
    }

    getInitialDataCopy(): AppState {
        return {...this.state};
    }

    deleteTalent = (id: number) => {
        var newTalents = this.state.talents.filter(
            talent => talent.id !== id
        )
        this.setState({...this.state, talents: newTalents});
    }
}

export default DataStore;