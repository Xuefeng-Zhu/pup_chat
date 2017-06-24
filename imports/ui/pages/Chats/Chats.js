import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table, Alert, ButtonToolbar, Button, OverlayTrigger,
         Popover, ListGroup, ListGroupItem, Glyphicon } from 'react-bootstrap';
import { timeago, monthDayYearAtTime } from '@cleverbeagle/dates';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import ChatsCollection from '../../../api/Chats/Chats';
import Loading from '../../components/Loading/Loading';

import './Chats.scss';

const handleRemove = (documentId, owner, user) => {
  const isOwner = owner === user._id;
  const confirmMessage = isOwner ? 'Are you sure to delete the chat' :
    'Are you sure to leave the chat?';
  const method = isOwner ? 'chats.remove' : 'chats.leave';
  const successMessage = isOwner ? 'Chat deleted!' : 'Left chat!';

  if (confirm(confirmMessage)) {
    Meteor.call(method, documentId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert(successMessage, 'success');
      }
    });
  }
};

const renderTableRow = ({ _id, owner, title, members, updatedAt }, match, history, user) => {
  const tooltip = (
    <Popover id="{_id}+popover">
      <ListGroup>
        {members.map(member => (
          <ListGroupItem key={member}>{member}</ListGroupItem>
        ))}
      </ListGroup>
    </Popover>);

  return (
    <tr key={_id}>
      <td>{title}</td>
      <td>
        <OverlayTrigger placement="bottom" overlay={tooltip}>
          <p>{members[0] + ' ...'}</p>
        </OverlayTrigger>
      </td>
      <td>{timeago(updatedAt)}</td>
      <td>
        <ButtonToolbar>
          <Button
            bsStyle="primary"
            onClick={() => history.push(`${match.url}/${_id}`)}
          >
            <Glyphicon glyph="eye-open" />
          </Button>
          <Button
            bsStyle="danger"
            onClick={() => handleRemove(_id, owner, user)}
          >
            <Glyphicon glyph="trash" />
          </Button>
        </ButtonToolbar>
      </td>
    </tr>);
}

const Chats = ({ loading, chats, match, history, user }) => (!loading ? (
  <div className="Chats">
    <div className="page-header clearfix">
      <h4 className="pull-left">Chats</h4>
      <Link className="btn btn-success pull-right" to={`${match.url}/new`}>Create new Chat</Link>
    </div>
    {chats.length ? <Table responsive>
      <thead>
        <tr>
          <th>Title</th>
          <th>Members</th>
          <th>Created</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {chats.map(chat => renderTableRow(chat, match, history, user))}
      </tbody>
    </Table> : <Alert bsStyle="warning">No chats yet!</Alert>}
  </div>
) : <Loading />);

Chats.propTypes = {
  loading: PropTypes.bool.isRequired,
  chats: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  user: PropTypes.object,
};

export default createContainer(() => {
  const subscription = Meteor.subscribe('chats');
  return {
    loading: !subscription.ready(),
    chats: ChatsCollection.find().fetch(),
    user: Meteor.user(),
  };
}, Chats);
