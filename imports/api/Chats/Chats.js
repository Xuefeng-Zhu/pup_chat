/* eslint-disable consistent-return */

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Chats = new Mongo.Collection('Chats');

Chats.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Chats.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Chats.schema = new SimpleSchema({
  owner: {
    type: String,
    label: 'The ID of the user this group belongs to.',
  },
  createdAt: {
    type: String,
    label: 'The date this group was created.',
    autoValue() {
      if (this.isInsert) return (new Date()).toISOString();
    },
  },
  updatedAt: {
    type: String,
    label: 'The date this group was last updated.',
    autoValue() {
      if (this.isInsert || this.isUpdate) return (new Date()).toISOString();
    },
  },
  title: {
    type: String,
    label: 'The title of the group.',
  },
  members: {
    type: Array,
    label: 'The members of the group.',
  },
  'members.$': {
    type: SimpleSchema.RegEx.Email
  }
});

Chats.attachSchema(Chats.schema);

export default Chats;
