import IModel from './IModel';

export default class SimpleModel<T> implements IModel<T> {
    protected counter: number = 0;
    protected models: Map<number, T>;

    private creationFunc: (id, name: string) => T;
    private cloneFunc: (el: T) => T;
    private idFunc: (el: T) => number;

    constructor(kvPairs: [number, T][],
        creationFunc: (id, name: string) => T,
        cloneFunc: (el: T) => T,
        idFunc: (el: T) => number) {
        this.creationFunc = creationFunc;
        this.cloneFunc = cloneFunc;
        this.idFunc = idFunc;

        kvPairs = kvPairs.map(pair => [pair[0], this.cloneFunc(pair[1])]);
        this.models = new Map<number, T>(kvPairs);

        for (let id in this.models) {
            // Pre-correct the counter for the ids of new elements
            let nId = parseInt(id) + 1;
            this.counter = this.counter > nId ? this.counter : nId;
        }
    }

    create(name: string): T {
        if (name === null)
            throw new TypeError("Can't create an element with a null name.");

        if (name === undefined)
            throw new TypeError("Can't create an element with an undefined name.");

        let model: T = this.creationFunc(this.counter, name);
        this.models.set(this.counter, model);
        this.counter++;
        this.save();
        return model
    }

    getAll(): T[] {
        return Array.from(this.models.values());
    }

    get(id: number): T | undefined {
        const el = this.models.get(id);

        if (el === undefined)
            return undefined;

        // Return a copy to extend immutability
        return this.cloneFunc(el);
    }

    update(element: T) {
        let clone = this.cloneFunc(element);
        this.models.set(this.idFunc(element), clone);
        this.save();
    }

    delete(element: T) {
        if (element === null)
            throw new TypeError("Can't delete a null element.");

        if (element === undefined)
            throw new TypeError("Can't delete an undefined element.");

        this.models.delete(this.idFunc(element));
        this.save();
    }

    deleteId(id: number) {
        this.models.delete(id);
        this.save();
    }

    protected save() {}
}