import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Messages from '../Messages';

Meteor.publish('messages', function chats(chatId) {
  check(chatId, String);
  return Messages.find({ chatId });
});
