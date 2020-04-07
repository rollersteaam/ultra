import { configureModel as configureTalentModel } from './actions/talentActions';
import { configureModel as configureSessionModel, configureIncubator } from './actions/timerActions';
import LocalTalentModel from './models/LocalTalentModel';
import LocalTalentSessionModel from './models/LocalTalentSessionModel';
import { TalentIncubator } from './models/TalentIncubator';

configureTalentModel(new LocalTalentModel());
configureSessionModel(new LocalTalentSessionModel());
configureIncubator(new TalentIncubator());