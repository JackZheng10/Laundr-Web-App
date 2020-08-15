const mongoose = require("mongoose");

//todo: sort out what is a string and what isnt
const OrderSchema = new mongoose.Schema({
  userInfo: {
    email: {
      type: String,
      unique: false,
      required: true,
    },
    phone: {
      type: String,
      unique: false,
      required: true,
    },
    fname: {
      type: String,
      unique: false,
      required: true,
    },
    lname: {
      type: String,
      unique: false,
      required: true,
    },
  },
  washerInfo: {
    scented: {
      type: Boolean,
      required: true,
      unique: false,
    },
    delicates: {
      type: Boolean,
      required: true,
      unique: false,
    },
    separate: {
      type: Boolean,
      required: true,
      unique: false,
    },
    towelsSheets: {
      type: Boolean,
      required: true,
      unique: false,
    },
    prefs: {
      type: String,
      required: true,
      unique: false,
    },
    address: {
      type: String,
      required: true,
      unique: false,
    },
    email: {
      type: String,
      required: true,
      unique: false,
    },
    phone: {
      type: String,
      required: true,
      unique: false,
    },
  },
  pickupInfo: {
    prefs: {
      type: String,
      required: true,
      unique: false,
    },
    date: {
      type: String,
      required: true,
      unique: false,
    },
    time: {
      type: String,
      required: true,
      unique: false,
    },
    driverEmail: {
      type: String,
      required: true,
      unique: false,
    },
  },
  dropoffInfo: {
    date: {
      type: String,
      required: true,
      unique: false,
    },
    time: {
      type: String,
      required: true,
      unique: false,
    },
    driverEmail: {
      type: String,
      required: true,
      unique: false,
    },
  },
  orderInfo: {
    coupon: {
      type: String,
      required: true,
      unique: false,
    },
    status: {
      type: Number,
      required: true,
      unique: false,
    },
    weight: {
      type: String,
      required: true,
      unique: false,
    },
    loads: {
      type: Number,
      required: true,
      unique: false,
    },
    cost: {
      type: Number,
      required: true,
      unique: false,
    },
    created: {
      type: Date,
      required: true,
      unique: false,
    },
    address: {
      type: String,
      required: true,
      unique: false,
    },
    orderID: {
      type: Number,
      required: true,
      unique: false,
    },
  },
});

const PendingOrder = mongoose.model("PendingOrder", OrderSchema);
const CompletedOrder = mongoose.model("CompletedOrder", OrderSchema);

module.exports = { PendingOrder, CompletedOrder };
