import { newTalent, deleteTalent, getTalents, configureModel, updateTalent, excludeTalent, includeTalent }  from './talentActions';
import { NEW_TALENT, DELETE_TALENT, GET_TALENTS, UPDATE_TALENT, EXCLUDE_TALENT, INCLUDE_TALENT } from './types';
import jokeDispatch from '../testutils/jokeDispatch';
import { createTalent, Talent } from '../models/Talent';
import IModel from '../models/IModel';
import LocalTalentModel from '../models/LocalTalentModel';

let testTalents: Talent[];
let model: IModel<Talent>;

class MockTalentModel implements IModel<Talent> {
    create(element: Talent): Talent {
        throw new Error("Method not implemented.");
    }
    getAll(): Talent[] {
        throw new Error("Method not implemented.");
    }
    get(id: number): Talent {
        throw new Error("Method not implemented.");
    }
    update(element: Talent): Talent {
        throw new Error("Method not implemented.");
    }
    delete(element: Talent): void {
        throw new Error("Method not implemented.");
    }
    deleteId(id: number): void {
        throw new Error("Method not implemented.");
    }
}

// Unit Tests

it("dispatches exclude request correctly", () => {
    let dis = jokeDispatch(excludeTalent(1));
    expect(dis).toBeCalledWith({
        type: EXCLUDE_TALENT,
        payload: 1
    })
})

it("dispatches include request correctly", () => {
    let testTalent = createTalent(1, "Hooray", 7);
    class TestTalentModel extends MockTalentModel {
        get(id: number): Talent {
            if (id === 1) {
                return testTalent;
            }

            throw new Error("Unexpected get call received.");
        }
    }
    configureModel(new TestTalentModel());

    let dis = jokeDispatch(includeTalent(1));
    expect(dis).toBeCalledWith({
        type: INCLUDE_TALENT,
        payload: testTalent
    });
})

// Integration Tests

beforeEach(() => {
    testTalents = [
        createTalent(0, "Programming"),
        createTalent(1, "Music Creation")
    ]
    model = new LocalTalentModel(testTalents);
    configureModel(model);
})

afterEach(() => {
    model = null;
    configureModel(null);
})

it("creates talent with correct dispatch", () => {
    let expectedTalent = createTalent(2, "My Talent");
    let dis = jokeDispatch(newTalent("My Talent"));
    expect(dis).toBeCalledWith({
        type: NEW_TALENT,
        payload: expectedTalent
    });
})

it("deletes talent with correct dispatch", () => {
    let dis = jokeDispatch(deleteTalent(7));
    expect(dis).toBeCalledWith({
        type: DELETE_TALENT,
        payload: 7
    })
})

it("gets talents with correct dispatch", () => {
    let dis = jokeDispatch(getTalents());
    expect(dis).toBeCalledWith({
        type: GET_TALENTS,
        payload: testTalents
    });
})

it("updates talents with correct dispatch", () => {
    let testTalent = testTalents[0];
    let dis = jokeDispatch(updateTalent(testTalent));
    expect(dis).toBeCalledWith({
        type: UPDATE_TALENT,
        payload: testTalent
    });
});

it("updates talent in model", () => {
    let testTalent = testTalents[0];
    let modelTalent = model.get(testTalent.id);

    expect(testTalent.name).not.toBe("Breakdancing");
    expect(modelTalent.name).not.toBe("Breakdancing");
    expect(modelTalent).toStrictEqual(testTalent);

    testTalent.name = "Breakdancing";

    expect(modelTalent.name).not.toBe("Breakdancing");
    expect(modelTalent).not.toStrictEqual(testTalent);

    jokeDispatch(updateTalent(testTalent));

    modelTalent = model.get(testTalent.id);
    
    expect(modelTalent).not.toBe(testTalent);
    expect(modelTalent).toStrictEqual(testTalent);
})

it("new talent creates new talent in state", () => {

});

it("new talent is saved across page reloads", () => {

});

it("deletes talent from ", () => {

})

it("delete talent is saved across page reloads", () => {
    
});