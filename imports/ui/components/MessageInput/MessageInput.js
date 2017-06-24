import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { FormGroup, Button } from 'react-bootstrap';

import './MessageInput.scss';

const handleSend = (chatId) => {
  const message = {
    chatId,
    content: this.body.value.trim(),
  };
  Meteor.call('messages.insert', message, (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      this.form.reset();
      Bert.alert('Message sent!', 'success');
    }
  });
};

const MessageInput = ({ chatId }) => (
  <div className="MessageInput">
    <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
      <FormGroup>
        <textarea
          className="form-control"
          name="body"
          ref={body => (this.body = body)}
          placeholder="Enter message to send!"
          rows="5"
        />
      </FormGroup>
      <Button type="submit" bsStyle="success" onClick={() => handleSend(chatId)}>
        Send
      </Button>
    </form>
  </div>
);

MessageInput.propTypes = {
  chatId: PropTypes.string.isRequired,
};

export default MessageInput;
