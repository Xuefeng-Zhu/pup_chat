import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, Glyphicon, Button } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import Chats from '../../../api/Chats/Chats';
import NotFound from '../NotFound/NotFound';
import Loading from '../../components/Loading/Loading';
import MessageList from '../../components/MessageList/MessageList';
import MessageInput from '../../components/MessageInput/MessageInput';

const handleRemove = (chatId, isOwner, history) => {
  const confirmMessage = isOwner ? 'Are you sure to delete the chat' :
    'Are you sure to leave the chat?';
  const method = isOwner ? 'chats.remove' : 'chats.leave';
  const successMessage = isOwner ? 'Chat deleted!' : 'Left chat!';

  if (confirm(confirmMessage)) {
    Meteor.call(method, chatId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert(successMessage, 'success');
        history.push('/chats');
      }
    });
  }
};

const renderDocument = (chat, user, match, history) => (chat ? (
  <div className="ViewChat">
    <div className="page-header clearfix">
      <h4 className="pull-left">{ chat && chat.title }</h4>
      <ButtonToolbar className="pull-right">
        {chat.owner === user._id &&
          <Button onClick={() => history.push(`${match.url}/edit`)} bsStyle="primary">
            <Glyphicon glyph="edit" />
          </Button>
        }
        <Button onClick={() => handleRemove(chat._id, chat.owner === user._id, history)} bsStyle="danger">
          <Glyphicon glyph={chat.owner === user._id ? 'trash' : 'log-out'} />
        </Button>
      </ButtonToolbar>
    </div>
    { chat && <MessageList chatId={chat._id} /> }
    { chat && <MessageInput chatId={chat._id} /> }
  </div>
) : <NotFound />);

const ViewChat = ({ loading, chat, user, match, history }) => (
  !loading ? renderDocument(chat, user, match, history) : <Loading />
);

ViewChat.propTypes = {
  loading: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  chat: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

export default createContainer(({ match }) => {
  const chatId = match.params._id;
  const subscription = Meteor.subscribe('chats.view', chatId);

  return {
    loading: !subscription.ready(),
    chat: Chats.findOne(chatId) || {},
    user: Meteor.user(),
  };
}, ViewChat);
