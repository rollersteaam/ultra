import SimpleModel from './SimpleModel';
import { Talent, createTalent, cloneTalent } from './Talent';

export default class TestTalentModel extends SimpleModel<Talent> {
    constructor(initialTalents: Talent[]) {
        let kvPairs: [number, Talent][] = initialTalents.map(tal => [tal.id, tal]);
        super(kvPairs, createTalent, cloneTalent, tal => tal.id);
    }
}