import IDataStore from "./IDataStore";

class DataStore implements IDataStore {
    private state: Readonly<any>;
    private setStateFunction: (state: any) => void;
    private counter: number = 3;

    constructor(setStateFunction: (state: any) => void) {
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
    
    createTalent(name: string) {
        this.counter++;
        this.setState({
            ...this.state,
            talents: [
                ...this.state.talents,
                {
                    id: this.counter,
                    name: name
                }
            ]
        });
    }

    getInitialDataCopy(): any {
        return {...this.state};
    }

    deleteTalent = (id: number) => {
        var newTalents = this.state.talents.filter(
            (talent: any) => talent.id !== id
        )
        this.setState({...this.state, talents: newTalents});
    }

    setState(state: any) {
        this.state = state;
        this.setStateFunction(state);
    }
}

export default DataStore;