import SimpleModel from './SimpleModel';
import { Talent, cloneTalent } from './Talent';

/**
 * Saves talents across sessions through the LocalStorage API.
 */
class LocalTalentModel extends SimpleModel<Talent> {
    constructor(initialTalents: Talent[] = []) {
        let talentPairs: [number, Talent][];

        if (initialTalents.length === 0) {
            const rawTalents = localStorage.getItem("talents");
            talentPairs = JSON.parse(rawTalents ?? "[]");
        } else {
            talentPairs = initialTalents.map(tal => [tal.id, tal]);
        }

        super(
            talentPairs,
            cloneTalent,
            tal => tal.id,
            (tal, id) => tal.id = id
        );
    }

    protected save() {
        localStorage.setItem(
            "talents",
            JSON.stringify(Array.from(this.models))
        );
    }
}

export default LocalTalentModel;