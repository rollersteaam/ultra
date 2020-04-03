import React, { FormEvent, ChangeEvent } from 'react';

import { Form, Input } from 'reactstrap';

import ITalentController from '../controllers/ITalentController';

type NewTalentFormProps = {
    controller: ITalentController
}

type NewTalentFormState = {
    name: string | null;
}

class NewTalentForm extends React.Component<NewTalentFormProps, NewTalentFormState> {
    onSubmit = (e: FormEvent) => {
        e.preventDefault();

        let name = this.state.name;

        if (name === null) return;

        this.props.controller.createTalent(name);
    }

    onChange = (e: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            name: e.target.value
        });
    }

    render() {
        return (
            <Form className="pt-3" onSubmit={this.onSubmit}>
                <Input name="name" onChange={this.onChange} />
            </Form>
        )
    }
}

export default NewTalentForm;