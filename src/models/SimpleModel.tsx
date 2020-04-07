import IModel from './IModel';

/**
 * Provides simple and fast in-memory storage for model items through a map.
 * 
 * Usefully combined with specialised model implementations for quick model
 * implementation and local caching capabilities.
 */
export default class SimpleModel<T> implements IModel<T> {
    protected counter: number = 0;
    protected models: Map<number, T>;

    private cloneFunc: (el: T) => T;
    private getIdFunc: (el: T) => number;
    private setIdFunc: (el: T, id: number) => void;

    constructor(kvPairs: [number, T][],
        cloneFunc: (el: T) => T,
        getIdFunc: (el: T) => number,
        setIdFunc: (el: T, id: number) => void) {
        if (kvPairs === undefined)
            throw new ReferenceError("Couldn't construct. KV Pairs argument was undefined.");

        if (cloneFunc === undefined)
            throw new ReferenceError("Couldn't construct. Clone function argument was undefined.");

        if (getIdFunc === undefined)
            throw new ReferenceError("Couldn't construct. Get ID function argument was undefined.");

        if (setIdFunc === undefined)
            throw new ReferenceError("Couldn't construct. Set ID function argument was undefined.");

        this.cloneFunc = cloneFunc;
        this.getIdFunc = getIdFunc;
        this.setIdFunc = setIdFunc;

        kvPairs = kvPairs.map(pair => [pair[0], this.cloneFunc(pair[1])]);
        this.models = new Map<number, T>(kvPairs);

        for (let id of Array.from(this.models.keys())) {
            if (isNaN(id))
                throw new EvalError(`Failed to initialize model object. Model ID: "${id}" evaluated to NaN during counter initialization.`);
            
            // Pre-correct the counter for the ids of new elements
            const nId = id + 1;
            this.counter = this.counter > nId ? this.counter : nId;
        }
    }

    create(model: T): T {
        if (model === null)
            throw new TypeError("Can't create an element with a null model argument.");

        if (model === undefined)
            throw new TypeError("Can't create an element with an undefined model argument.");

        if (this.models.has(this.counter))
            throw new RangeError("Couldn't create model. ID from counter already exists in the model, which should never happen. Model may be corrupt.");

        let clone = this.cloneFunc(model);
        this.setIdFunc(clone, this.counter);
        this.models.set(this.counter, clone);
        this.counter++;
        this.save();
        return this.cloneFunc(clone);
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

    update(element: T): T {
        let clone = this.cloneFunc(element);
        this.models.set(this.getIdFunc(element), clone);
        this.save();
        return this.cloneFunc(clone);
    }

    delete(element: T) {
        if (element === null)
            throw new TypeError("Can't delete a null element.");

        if (element === undefined)
            throw new TypeError("Can't delete an undefined element.");

        this.models.delete(this.getIdFunc(element));
        this.save();
    }

    deleteId(id: number) {
        this.models.delete(id);
        this.save();
    }

    protected save() {}
}