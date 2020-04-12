import talentReducer, { TalentReducerState } from './talentReducer';
import { createTalent, cloneTalent } from '../models/Talent';
import { EXCLUDE_TALENT, INCLUDE_TALENT, UPDATE_TALENT, CALCULATE_PROGRESSION } from '../actions/types';

// Unit Tests

it("excludes a talent from state", () => {
    let state: TalentReducerState = {
        items: [
            createTalent(0, "My Not Excluded Talent"),
            createTalent(1, "My Excluded Talent"),
            createTalent(2, "My Not Excluded Talent"),
        ],
        lastBeginsEditing: false
    }
    let newState = talentReducer(state, {
        type: EXCLUDE_TALENT,
        payload: 1
    });
    expect(newState).toStrictEqual({
        ...state,
        items: state.items.filter(tal => tal.id !== 1)
    })
})

it("includes a talent into its state", () => {
    let newTalent = createTalent(2, "My Not Excluded Talent");
    let state: TalentReducerState = {
        items: [
            createTalent(0, "My Not Excluded Talent"),
            createTalent(1, "My Excluded Talent"),
        ],
        lastBeginsEditing: false
    }
    let newState = talentReducer(state, {
        type: INCLUDE_TALENT,
        payload: newTalent
    });
    expect(newState).toStrictEqual({
        ...state,
        items: [
            ...state.items,
            newTalent
        ],
        lastBeginsEditing: false
    });
});

it("updates a talent within state", () => {
    let targetTalent = createTalent(1, "My Excluded Talent");
    let cloneTargetTalent = cloneTalent(targetTalent);

    expect(cloneTargetTalent).not.toBe(targetTalent);
    expect(cloneTargetTalent).toStrictEqual(targetTalent);

    let innocentTalent = createTalent(0, "My Not Excluded Talent");

    let state: TalentReducerState = {
        items: [
            innocentTalent,
            cloneTargetTalent,
        ],
        lastBeginsEditing: false
    }

    targetTalent.name = "My Changed Talent";

    let newState = talentReducer(state, {
        type: UPDATE_TALENT,
        payload: targetTalent
    });
    expect(newState).toStrictEqual({
        ...state,
        items: [
            innocentTalent,
            targetTalent
        ]
    });
})

it("reduces new talents from progression into state", () => {
    let talentOne = createTalent(1, "My Excluded Talent");
    let talentTwo = createTalent(0, "My Not Excluded Talent");

    let state: TalentReducerState = {
        items: [],
        lastBeginsEditing: false
    }

    let newState = talentReducer(state, {
        type: CALCULATE_PROGRESSION,
        payload: {
            talents: [
                talentOne,
                talentTwo
            ],
            sessions: []
        }
    });

    expect(newState).toStrictEqual({
        ...state,
        items: [
            talentOne,
            talentTwo
        ]
    });
});