import Talent from '../models/Talent';

interface ITalentController {
    deleteTalent(id: number): void;
    createTalent(name: string): void;
}

export default ITalentController;