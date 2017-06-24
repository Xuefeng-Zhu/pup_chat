import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Messages from './Messages';
import rateLimit from '../../modules/rate-limit';

Meteor.methods({
  'messages.insert': function messagesInsert(doc) {
    check(doc, {
      chatId: String,
      content: String,
    });

    try {
      const user = Meteor.users.findOne(this.userId);
      const ownerEmail = user.emails[0].address;
      return Messages.insert({ ownerEmail, owner: this.userId, ...doc });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
});

rateLimit({
  methods: [
    'messages.insert',
  ],
  limit: 5,
  timeRange: 1000,
});
