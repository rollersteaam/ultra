import SimpleModel from './SimpleModel';
import { createTalent } from './Talent';

// Unit Tests

type TestType = {
    id: number,
    name: string
}

let typeElements: TestType[] = null;
let elements: [number, TestType][] = null;
let sm: SimpleModel<TestType> = null;

beforeEach(() => {
    typeElements = [
        {id: 0, name: "Sam"},
        {id: 1, name: "Michael"},
        {id: 3, name: "Andrew"}
    ]
    elements = typeElements.map(te => [te.id, te]);
    sm = new SimpleModel<TestType>(
        elements,
        (el: TestType) => ({
            id: el.id,
            name: el.name
        }),
        (el: TestType) => el.id,
        (el: TestType, id: number) => {
            el.id = id;
        }
    );
})

afterEach(() => {
    elements = null;
    sm = null;
})

it("constructs from empty list without crashing", () => {
    sm = new SimpleModel<TestType>(
        [],
        (el: TestType) => ({
            id: el.id,
            name: el.name
        }),
        (el: TestType) => el.id,
        (el: TestType, id: number) => {
            el.id = id;
        }
    );
})

it("throws error when an initialization model of NaN id is passed into constructor", () => {
    expect(() => {
        sm = new SimpleModel<TestType>(
            [[NaN, {id: NaN, name: "Trojan Horse"}]],
            (el: TestType) => ({
                id: el.id,
                name: el.name
            }),
            (el: TestType) => el.id,
            (el: TestType, id: number) => {
                el.id = id;
            }
        );
    }).toThrowError(EvalError);
})

it("throws error when any constructor argument is undefined", () => {
    function construct(kvPairs: [number, TestType][],
        cloneFunc: (el: TestType) => TestType,
        getIdFunc: (el: TestType) => number,
        setIdFunc: (el: TestType, id: number) => void) {
            return new SimpleModel<TestType>(
                kvPairs,
                cloneFunc,
                getIdFunc,
                setIdFunc
            );
    }

    const arg1 = elements;
    const arg2 = (el: TestType) => ({
        id: el.id,
        name: el.name
    });
    const arg3 = (el: TestType) => el.id;
    const arg4 = (el: TestType, id: number) => el.id = id;

    expect(() => {
        construct(undefined, arg2, arg3, arg4)
    }).toThrowError(ReferenceError);

    expect(() => {
        construct(arg1, undefined, arg3, arg4)
    }).toThrowError(ReferenceError);

    expect(() => {
        construct(arg1, arg2, undefined, arg4)
    }).toThrowError(ReferenceError);

    expect(() => {
        construct(arg1, arg2, arg3, undefined)
    }).toThrowError(ReferenceError);
});

it("creates an element", () => {
    let talent = createTalent(0, "Gangley");
    let modelTalent = sm.create(talent);

    // Assert that references are different
    expect(modelTalent).not.toBe(talent);

    // Assert that they are the same talent
    expect(modelTalent.name).toBe(talent.name);

    // Assert that given ID was not used
    expect(modelTalent.id).not.toBe(talent.id);
});

it("creates an element and saves it in the model", () => {
    let talent = createTalent(0, "Gangley");
    let modelTalent = sm.create(talent);
    let modelGetTalent = sm.get(talent.id);

    // Assert that refs are not the same
    expect(modelGetTalent).not.toBe(modelTalent);

    // Assert model returned from creation has same properties as getting
    expect(modelGetTalent).toStrictEqual(modelTalent);
});

it("creates an element from next highest id", () => {
    let talent = createTalent(0, "Maverick");
    let modelTalent = sm.create(talent);
    
    expect(modelTalent.id).toBe(4);
    expect(modelTalent.name).toBe(talent.name);
});

it("doesn't create an element when name is null or undefined", () => {
    expect(() => sm.create(undefined)).toThrowError(TypeError);
    expect(() => sm.create(null)).toThrowError(TypeError);
})

it("gets a copy of elements it contains", () => {
    let elm = sm.get(0);
    let originalElement = elements[0][1];
    expect(elm).toStrictEqual(originalElement);
    expect(elm).not.toBe(originalElement);
});

it("gets a copy of all elements", () => {
    let elementsCopy = sm.getAll();
    expect(elementsCopy).toStrictEqual(typeElements);
    expect(elementsCopy).not.toBe(typeElements);
})

it("gets undefined when element not in model", () => {
    let el = sm.get(50);
    expect(el).toBeUndefined();
})

it("initializes with a deep copy of the initial elements", () => {
    let el = typeElements[2];
    el.name = "August";

    expect(sm.get(el.id).name).not.toBe("August");
})

it("updates element with deep copy", () => {
    let el = typeElements[2];
    el.name = "August";

    expect(sm.get(el.id).name).not.toBe("August");

    let newEl = sm.update(el);

    el.name = "June";
    let modelEl = sm.get(el.id);

    expect(modelEl.name).not.toBe("June");
    expect(modelEl.name).toBe("August");
    expect(modelEl).not.toBe(el);

    expect(newEl).not.toBe(el);
    expect(newEl).not.toBe(modelEl);
    expect(newEl).toStrictEqual(modelEl);
})

it("deletes element by reference", () => {
    let el = typeElements[2];

    expect(el).not.toBeUndefined();
    expect(el).not.toBeNull();

    expect(sm.get(el.id)).toStrictEqual(el);

    sm.delete(el);

    expect(sm.get(el.id)).toBeUndefined();
});

it("does nothing when deleting null or undefined element", () => {
    expect(() => sm.delete(undefined)).toThrowError(TypeError);
    expect(() => sm.delete(null)).toThrowError(TypeError);
})

it("deletes element by id", () => {
    let el = typeElements[2];

    expect(el).not.toBeUndefined();
    expect(el).not.toBeNull();

    expect(sm.get(el.id)).toStrictEqual(el);
    
    sm.deleteId(el.id);

    expect(sm.get(el.id)).toBeUndefined();
});