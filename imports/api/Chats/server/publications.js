import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Chats from '../Chats';

Meteor.publish('chats', function chats() {
  return Chats.find({ owner: this.userId });
});

// Note: chats.view is also used when editing an existing document.
Meteor.publish('chats.view', function chatsView(documentId) {
  check(documentId, String);
  return Chats.find({ _id: documentId, owner: this.userId });
});
