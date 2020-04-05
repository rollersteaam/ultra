import { newTalent, deleteTalent, configureModel }  from './talentActions';
import { NEW_TALENT, DELETE_TALENT } from './types';
import jokeDispatch from '../testutils/jokeDispatch';
import { createTalent, Talent } from '../models/Talent';
import IModel from '../models/IModel';

// Unit Tests

/**
 * 
 */


// configureModel()

it("returns correct new talent dispatch", () => {
    let expectedTalent = createTalent(0, "My Talent");
    let dis = jokeDispatch(newTalent("My Talent"));
    expect(dis).toBeCalledWith({
        type: NEW_TALENT,
        payload: expectedTalent
    })
});

it("returns correct delete talent dispatch", () => {
    let dis = jokeDispatch(deleteTalent(7));
    expect(dis).toBeCalledWith({
        type: DELETE_TALENT,
        payload: 7
    })
})

// Integration Tests

it("new talent creates new talent in state", () => {

});

it("new talent is saved across page reloads", () => {

});

it("deletes talent from ", () => {

})



it("delete talent is saved across page reloads", () => {
    
});