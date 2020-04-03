import Talent from "../models/Talent";

interface IDataStore {
    getTalents(): Talent[]
    deleteTalent(id: number): void
}

export default IDataStore;