import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Chats from '../Chats';

Meteor.publish('chats', function chats() {
  const user = Meteor.users.findOne(this.userId);
  return Chats.find({ members: user.emails[0].address });
});

// Note: chats.view is also used when editing an existing document.
Meteor.publish('chats.view', function chatsView(documentId) {
  check(documentId, String);
  const user = Meteor.users.findOne(this.userId);
  return Chats.find({
    _id: documentId,
    members: user.emails[0].address
  });
});
