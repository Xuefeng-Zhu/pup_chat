import React from 'react';
import PropTypes from 'prop-types';
import ChatEditor from '../../components/ChatEditor/ChatEditor';

const NewChat = ({ history }) => (
  <div className="NewChat">
    <h4 className="page-header">New Chat</h4>
    <ChatEditor history={history} />
  </div>
);

NewChat.propTypes = {
  history: PropTypes.object.isRequired,
};

export default NewChat;
