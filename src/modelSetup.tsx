import LocalTalentModel from './models/LocalTalentModel';
import { configureModel }  from './actions/talentActions';

configureModel(new LocalTalentModel());