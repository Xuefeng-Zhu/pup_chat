import React from 'react';
import PropTypes from 'prop-types';
import { timeago } from '@cleverbeagle/dates';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Alert, ListGroup, ListGroupItem } from 'react-bootstrap';
import Messages from '../../../api/Messages/Messages';
import Loading from '../../components/Loading/Loading';

import './MessageList.scss';

const renderMessage = message => (
  <ListGroupItem key={message._id}>
    <div className="msg-header">
      <span className="msg-sender">{message.ownerEmail}</span>
      <span className="msg-date">{timeago(message.createdAt)}</span>
    </div>

    {message.content}
  </ListGroupItem>
);

const MessageList = ({ loading, messages }) => {
  if (loading) {
    return <Loading />;
  }

  if (!messages.length) {
    return (
      <Alert bsStyle="info">
        Enter message below to send your first message!
      </Alert>
    );
  }

  const style = {
    height: window.innerHeight - 283,
  };

  return (
    <div className="MessageList" style={style}>
      <ListGroup>
        {messages.map(message => renderMessage(message))}
      </ListGroup>
    </div>
  );
};

MessageList.propTypes = {
  loading: PropTypes.bool.isRequired,
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default createContainer(({ chatId }) => {
  const subscription = Meteor.subscribe('messages', chatId);

  return {
    loading: !subscription.ready(),
    messages: Messages.find().fetch(),
  };
}, MessageList);
