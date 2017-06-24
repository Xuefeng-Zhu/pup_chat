/* eslint-disable consistent-return */

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Messages = new Mongo.Collection('Messages');

Messages.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Messages.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Messages.schema = new SimpleSchema({
  createdAt: {
    type: String,
    label: 'The date this message was created.',
    autoValue() {
      if (this.isInsert) return (new Date()).toISOString();
    },
  },
  chatId: {
    type: String,
    label: 'The ID of the chat this message belongs to.',
  },
  owner: {
    type: String,
    label: 'The ID of the user this message belongs to.',
  },
  ownerEmail: {
    type: SimpleSchema.RegEx.Email,
  },
  content: {
    type: String,
    label: 'The content of the message.',
  },
});

Messages.attachSchema(Messages.schema);

export default Messages;
