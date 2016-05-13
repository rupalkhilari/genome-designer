import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
import uuid from 'node-uuid';

/**
 * basic order schema
 * @type {mongoose.Schema}
 */
var orderSchema = new Schema({

  // user ID of the account that created the order
  creator: {
    type    : String,
    required: true,
  },

  // creation date
  created: {
    type   : Date,
    default: Date.now,
  },

  // modification date, changed on each save
  modified: {
    type   : Date,
    default: Date.now,
  },

  // the project ID this order references
  projectId: {
    type    : String,
    required: true,
  },

});

/**
 * create a new order
 * @param  {String}   creator   - user id of order creator
 * @param  {String}   projectId - project id this order is derived from
 * @param  {Function} callback
 */
orderSchema.statics.create = function (creator, projectId, callback) {
  return new Promise((resolve, reject) => {
    // must have a user
    if (!creator) {
      reject({
        error: "No creator specified",
      });
      return;
    }
    const order = new orderModel({creator, projectId});
    order.save(function (err) {
      if (err) {
        reject({
          error: err.toString(),
        });
      } else {
        resolve({
          id: order._doc._id.toString(),
        });
      }
    });
  });
};

/**
 * export the model not the schema
 */
const orderModel = mongoose.model('Order', orderSchema);
module.exports = orderModel;
