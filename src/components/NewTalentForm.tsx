import React, { FormEvent, ChangeEvent, useState, useCallback } from 'react';

import { Form, Input } from 'reactstrap';
import { useDispatch } from 'react-redux';

import { newTalent } from '../actions/talentActions';


function NewTalentForm() {
    const [name, setName] = useState("");

    const dispatch = useDispatch();
    const newTalentMemo = useCallback(
        (name: string) => dispatch(newTalent(name)),
        [dispatch]
    );

    const onSubmit = useCallback(
        (e: FormEvent) => {
            e.preventDefault();
            newTalentMemo(name);
            setName("");
        },
        [newTalentMemo, name, setName]
    );
    const onChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            setName(e.target.value);
        },
        [setName]
    );

    return (
        <Form className="pt-3" onSubmit={onSubmit}>
            <Input name="name" onChange={onChange} value={name} test-id="newTalentForm.Input" />
        </Form>
    )
}

export default NewTalentForm;