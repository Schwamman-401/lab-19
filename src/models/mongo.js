'use strict';
const eventHub = require('../middleware/eventHub');

/** Class representing a generic mongo model. */
class Model {

  /**
   * Model Constructor
   * @param schema {object} - mongo schema
   */
  constructor(schema) {
    this.schema = schema;
  }

  /**
   * Retrieves one or more records
   * @param id {string} optional mongo record id
   * @returns {count:#,results:[{*}]} | {*}
   */
  async get(id) {
    // Call the appropriate mongoose method to get
    // one or more records

    // If 1, return it as a plain object
    if (id) {
      let payload = this.schema.findOne({ _id: id});
      eventHub.emit('read', payload);
      return payload;
    }
    // If 2, return it as an object like this:
    // { count: ##, results: [{}, {}] }   
    else {
      let results = await this.schema.find({});
      let payload = { count: results.length, results: results};
      eventHub.emit('read', payload);
      return payload;
    }
  }

  /**
   * Create a new record
   * @param record {object} matches the format of the schema
   * @returns {*}
   */
  post(record) {
    // Call the appropriate mongoose method to create a new record
    let newRecord = new this.schema(record);
    eventHub.emit('create', newRecord);
    return newRecord.save();
  }

  /**
   * Replaces a record in the database
   * @param id {string} Mongo Record ID
   * @param record {object} The record data to replace. ID is a required field
   * @returns {*}
   */
  put(id, record) {
    // Call the appropriate mongoose method to update a record
    eventHub.emit('update', record);
    return this.schema.findByIdAndUpdate(id, record, { new: true });
  }

  /**
   * Deletes a recod in the model
   * @param id {string} Mongo Record ID
   * @returns {*}
   */
  delete(id) {
    // Call the appropriate mongoose method to delete a record
    eventHub.emit('delete', id);
    return this.schema.findByIdAndDelete(id);
  }

}

module.exports = Model;
