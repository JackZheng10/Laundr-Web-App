const { showConsoleError, caughtError } = require("../helpers/errors");
const Order = require("../models/Order");

//change to fetchorder
const checkExistingOrder = async (req, res, next) => {
  try {
    //find an order that isn't cancelled or confirmed finished
    const order = await Order.findOne({
      "userInfo.email": req.body.email,
      "orderInfo.status": { $nin: [7, 8] },
    });

    if (order) {
      return res.json({
        success: false,
        message:
          "You already have an active order. Please refresh the page or contact us.",
      });
    } else {
      next();
    }
  } catch (error) {
    showConsoleError("checking existing order", error);
    return res.json({
      success: false,
      message: caughtError("checking existing order", error, 99),
    });
  }
};

const countOrders = async (req, res, next) => {
  try {
    const count = await Order.countDocuments();

    if (count) {
      res.locals.count = count;
    } else {
      res.locals.count = 0;
    }

    next();
  } catch (error) {
    showConsoleError("counting orders", error);
    return res.json({
      success: false,
      message: caughtError("counting orders", error, 99),
    });
  }
};

const placeOrder = async (req, res) => {
  try {
    const orderCount = res.locals.count;

    const order = await Order.create({
      userInfo: {
        email: req.body.email,
        phone: req.body.phone,
        fname: req.body.fname,
        lname: req.body.lname,
      },
      washerInfo: {
        scented: req.body.scented,
        delicates: req.body.delicates,
        separate: req.body.separate,
        towelsSheets: req.body.towelsSheets,
        prefs: req.body.washerPrefs,
        address: "978 SW 2nd Ave, Gainesville, FL 32601", //default
        email: "w1@gmail.com", //default
        phone: "laundrPhone#", //default
      },
      pickupInfo: {
        prefs: req.body.addressPrefs,
        date: req.body.pickupDate,
        time: req.body.pickupTime,
        driverEmail: "N/A",
      },
      dropoffInfo: {
        date: "N/A",
        time: "N/A",
        driverEmail: "N/A",
      },
      orderInfo: {
        coupon: req.body.coupon,
        status: 0,
        weight: "N/A",
        cost: -1, //default, like N/A is
        created: req.body.created,
        address: req.body.address,
        orderID: orderCount + 1,
      },
    });

    return res.json({
      success: true,
      message: "Order successfully placed.",
      orderID: order.orderInfo.orderID,
    });
  } catch (error) {
    showConsoleError("placing order", error);
    return res.json({
      success: false,
      message: caughtError("placing order", error, 99),
    });
  }
};

const fetchOrders = async (req, res) => {
  //filter by email here so other info not leaked
  try {
    const statuses = req.body.statuses;
    const filter = req.body.filter;

    let orders = await Order.find().where("orderInfo.status").in(statuses);

    //if any filtering by email needs to be applied
    if (filter) {
      const filterConfig = req.body.filterConfig;
      const filterEmail = req.body.filterEmail;

      switch (filterConfig) {
        case "driverAccepted":
          orders = orders.filter((order) => {
            return (
              order.pickupInfo.driverEmail === filterEmail ||
              order.dropoffInfo.driverEmail === filterEmail
            );
          });
          break;

        case "washerAssigned":
          orders = orders.filter((order) => {
            return order.washerInfo.email === filterEmail;
          });
          break;
      }
    }

    return res.json({ success: true, message: orders });
  } catch (error) {
    showConsoleError("getting orders", error);
    return res.json({
      success: false,
      message: caughtError("getting orders", error, 99),
    });
  }
};

const getExistingOrder = async (req, res) => {
  //find the order that isn't cancelled or done, should only ever be one. if more than one, undefined behavior since findOne returns only one
  try {
    const order = await Order.findOne({
      "userInfo.email": req.query.email,
      "orderInfo.status": { $nin: [7, 8] },
    });

    if (order) {
      return res.json({
        success: true,
        message: order,
      });
    } else {
      return res.json({
        success: true,
        message: "N/A",
      });
    }
  } catch (error) {
    showConsoleError("getting existing order", error);
    return res.json({
      success: false,
      message: caughtError("getting existing order", error, 99),
    });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      "orderInfo.orderID": req.query.orderID,
    });

    //if order has been picked up, since 2 is when weight is entered
    if (order.orderInfo.status > 1) {
      return res.json({
        success: false,
        message: "Order cannot be cancelled after pickup.",
      });
    }

    order.orderInfo.status = 7;

    await order.save();

    return res.json({
      success: true,
      message: "Order successfully cancelled.",
    });
  } catch (error) {
    showConsoleError("cancelling order", error, 99);
    return res.json({
      success: false,
      message: caughtError("cancelling order", error, 99),
    });
  }
};

const setDropoff = async (req, res) => {
  try {
    const order = await Order.findOne({
      "orderInfo.orderID": req.body.orderID,
    });

    order.dropoffInfo.date = req.body.date;
    order.dropoffInfo.time = req.body.time;

    await order.save();

    return res.json({
      success: true,
      message: "Dropoff successfully set.",
    });
  } catch (error) {
    showConsoleError("setting dropoff time", error, 99);
    return res.json({
      success: false,
      message: caughtError("setting dropoff time", error, 99),
    });
  }
};

module.exports = {
  checkExistingOrder,
  countOrders,
  placeOrder,
  fetchOrders,
  getExistingOrder,
  cancelOrder,
  setDropoff,
};
