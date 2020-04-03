import Talent from '../models/Talent';
import { AppState } from '../App';

interface ITalentController {
    getTalents(): Talent[];
    deleteTalent(state: AppState, id: number): AppState;
}

export default ITalentController;