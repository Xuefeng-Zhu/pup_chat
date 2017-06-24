import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import Chats from '../../../api/Chats/Chats';
import ChatEditor from '../../components/ChatEditor/ChatEditor';
import NotFound from '../NotFound/NotFound';

const EditChat = ({ chat, history }) => (chat ? (
  <div className="EditChat">
    <h4 className="page-header">{`Editing "${chat.title}"`}</h4>
    <ChatEditor chat={chat} history={history} />
  </div>
) : <NotFound />);

EditChat.propTypes = {
  chat: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default createContainer(({ match }) => {
  const chatId = match.params._id;
  const subscription = Meteor.subscribe('chats.view', chatId);

  return {
    loading: !subscription.ready(),
    chat: Chats.findOne(chatId),
  };
}, EditChat);
