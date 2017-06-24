import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import Chats from './Chats';
import rateLimit from '../../modules/rate-limit';

Meteor.methods({
  'chats.insert': function chatsInsert(doc) {
    check(doc, {
      title: String,
      members: [String],
    });

    try {
      return Chats.insert({ owner: this.userId, ...doc });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'chats.update': function chatsUpdate(doc) {
    check(doc, {
      _id: String,
      title: String,
      members: [String],
    });

    try {
      const chatId = doc._id;
      const chat = Chats.findOne(chatId);
      if (chat.owner !== this.userId) {
        throw new Meteor.Error('500', 'You are not the owner of the chat');
      }

      Chats.update(chatId, { $set: doc });
      return chatId; // Return _id so we can redirect to document after update.
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'chats.remove': function chatsRemove(chatId) {
    check(chatId, String);

    try {
      const chat = Chats.findOne(chatId);
      if (chat.owner !== this.userId) {
        throw new Meteor.Error('500', 'You are not the owner of the chat');
      }

      return Chats.remove(chatId);
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'chats.leave': function chatsLeave(chatId) {
    check(chatId, String);

    try {
      const user = Meteor.user();

      Chats.update(chatId, {
        $pull: {
          members: user.emails[0].address,
        },
      });
      return chatId;
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
});

rateLimit({
  methods: [
    'chats.insert',
    'chats.update',
    'chats.remove',
  ],
  limit: 5,
  timeRange: 1000,
});
