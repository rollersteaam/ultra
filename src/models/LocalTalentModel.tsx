import IModel from './IModel';
import { Talent, createTalent, cloneTalent } from './Talent';

class LocalTalentModel implements IModel<Talent> {
    private talents: Map<number, Talent>
    private counter: number = 0

    constructor() {
        const rawTalents = localStorage.getItem("talents");
        const talentPairs: [[number, Talent]] = JSON.parse(rawTalents ?? "[]");
        this.talents = new Map<number, Talent>(talentPairs);

        for (let id in this.talents) {
            // Pre-correct the counter for the ids of new elements
            let nId = parseInt(id) + 1;
            this.counter = this.counter > nId ? this.counter : nId;
        }
    }

    create(name: string): Talent {
        const newIndex = this.counter++;
        const newTalent = createTalent(newIndex, name, 0, 0);
        this.talents.set(newIndex, newTalent);
        this.save();
        return newTalent;
    }

    getAll(): Talent[] {
        return Array.from(this.talents.values());
    }

    get(id: number): Talent | undefined {
        const el = this.talents.get(id);

        if (el === undefined)
            return undefined;

        // Return a copy to extend immutability
        return cloneTalent(el);
    }

    update(element: Talent) {
        this.talents.set(element.id, element);
        this.save();
    }

    delete(element: Talent) {
        this.talents.delete(element.id);
        this.save();
    }

    deleteId(id: number) {
        this.talents.delete(id);
        this.save();
    }

    private save() {
        localStorage.setItem(
            "talents",
            JSON.stringify(Array.from(this.talents))
        );
    }
}

export default LocalTalentModel;