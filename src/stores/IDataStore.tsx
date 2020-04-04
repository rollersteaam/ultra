interface IDataStore {
    deleteTalent(id: number): void;
    createTalent(name: string): void;
    getInitialDataCopy(): any;
}

export default IDataStore;