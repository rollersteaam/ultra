import React, { FormEvent, ChangeEvent, useState, useCallback } from 'react';

import { Form, Input } from 'reactstrap';

import { useDispatch } from 'react-redux';
import { NEW_TALENT } from '../actions/types';

function NewTalentForm() {
    const [name, setName] = useState("");

    const dispatch = useDispatch();
    const newTalent = useCallback(
        () => {
            dispatch({ type: NEW_TALENT, payload: name })
        },
        [dispatch, name]
    );

    const onSubmit = useCallback(
        (e: FormEvent) => {
            e.preventDefault();
            newTalent();
            setName("");
        },
        [setName, newTalent]
    );
    const onChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            setName(e.target.value);
        },
        [setName]
    );

    return (
        <Form className="pt-3" onSubmit={onSubmit}>
            <Input name="name" onChange={onChange} value={name} />
        </Form>
    )
}

export default NewTalentForm;