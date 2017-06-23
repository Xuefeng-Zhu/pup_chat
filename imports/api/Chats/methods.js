import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import Chats from './Chats';
import rateLimit from '../../modules/rate-limit';

Meteor.methods({
  'groups.insert': function groupsInsert(doc) {
    check(doc, {
      title: String,
      member: [SimpleSchema.RegEx.Email],
    });

    try {
      return Chats.insert({ owner: this.userId, ...doc });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'groups.update': function groupsUpdate(doc) {
    check(doc, {
      _id: String,
      title: String,
      member: [SimpleSchema.RegEx.Email],
    });

    try {
      const groupId = doc._id;
      Chats.update(groupId, { $set: doc });
      return groupId; // Return _id so we can redirect to document after update.
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'groups.remove': function groupsRemove(groupId) {
    check(groupId, String);

    try {
      return Chats.remove(groupId);
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
});

rateLimit({
  methods: [
    'groups.insert',
    'groups.update',
    'groups.remove',
  ],
  limit: 5,
  timeRange: 1000,
});
