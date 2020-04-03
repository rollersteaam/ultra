import Talent from '../models/Talent';

interface ITalentController {
    getTalents(): Talent[];
    deleteTalent(id: number): void;
}

export default ITalentController;