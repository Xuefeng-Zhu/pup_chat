/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import SimpleSchema from 'simpl-schema';
import { createContainer } from 'meteor/react-meteor-data';
import { FormGroup, ControlLabel, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import _ from 'underscore';
import MultiSelect from 'react-tokeninput';
import validate from '../../../modules/validate';

class ChatEditor extends React.Component {
  constructor(props) {
    super(props);
    const { chat, user } = props;
    const members = chat.members;
    if (!members.length) {
      members.push(user.emails[0].address);
    }

    this.state = {
      members: members.map(email => ({
        id: email,
        name: email,
      })),
    };

    this.handleSelect = this.handleSelect.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  componentDidMount() {
    const component = this;
    validate(component.form, {
      rules: {
        title: {
          required: true,
        },
        members: {
          required: true,
        },
      },
      messages: {
        title: {
          required: 'A title is required',
        },
        body: {
          required: 'Members are required.',
        },
      },
      submitHandler() { component.handleSubmit(); },
    });
  }

  handleSubmit() {
    const { history } = this.props;
    const members = this.state.members.map(member => member.name);
    const existing = this.props.chat && this.props.chat._id;
    const methodToCall = existing ? 'chats.update' : 'chats.insert';
    const chat = {
      members,
      title: this.title.value.trim(),
    };

    if (existing) chat._id = existing;

    Meteor.call(methodToCall, chat, (error, chatId) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        const confirmation = existing ? 'Chat updated!' : 'Chat created!';
        this.form.reset();
        Bert.alert(confirmation, 'success');
        history.push(`/chats/${chatId}`);
      }
    });
  }

  handleRemove(value) {
    this.setState({
      members: this.state.members.filter((member) => {
        if (member.name === value.name) {
          if (member.name === this.props.user.emails[0].address) {
            Bert.alert('Must keep current user email', 'warning');
            return true;
          }
          return false;
        }

        return true;
      }),
    });
  }

  handleSelect(value) {
    let member = value;
    if (typeof value === 'string') {
      member = { id: value, name: value };
    }

    if (!SimpleSchema.RegEx.Email.test(member.name)) {
      Bert.alert('The input is not valid email address', 'danger');
      return;
    }

    const members = this.state.members.concat([member]);
    this.setState({
      members,
    });
  }

  render() {
    const { chat } = this.props;
    const { members } = this.state;

    return (<form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
      <FormGroup>
        <ControlLabel>Title</ControlLabel>
        <input
          type="text"
          className="form-control"
          name="title"
          ref={title => (this.title = title)}
          defaultValue={chat && chat.title}
          placeholder="Title for the chat"
        />
      </FormGroup>
      <FormGroup>
        <ControlLabel>Members</ControlLabel>
        <MultiSelect
          placeholder="Enter member email here"
          onInput={_.noop}
          onSelect={this.handleSelect}
          onRemove={this.handleRemove}
          selected={members}
        />
      </FormGroup>
      <Button type="submit" bsStyle="success">
        {chat && chat._id ? 'Save Changes' : 'Create Chat'}
      </Button>
    </form>);
  }
}

ChatEditor.defaultProps = {
  chat: { title: '', members: [] },
};

ChatEditor.propTypes = {
  chat: PropTypes.object,
  user: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default createContainer(() => ({
  user: Meteor.user(),
}), ChatEditor);
