import { newTalent, deleteTalent, getTalents, configureModel, updateTalent }  from './talentActions';
import { NEW_TALENT, DELETE_TALENT, GET_TALENTS, UPDATE_TALENT } from './types';
import jokeDispatch from '../testutils/jokeDispatch';
import { createTalent, Talent } from '../models/Talent';
import IModel from '../models/IModel';
import LocalTalentModel from '../models/LocalTalentModel';

// Integration Tests

let testTalents: Talent[];
let model: IModel<Talent>;

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

// Integration Tests

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