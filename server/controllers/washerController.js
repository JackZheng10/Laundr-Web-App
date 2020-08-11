const { showConsoleError, caughtError } = require("../helpers/errors");
const { PendingOrder, CompletedOrder } = require("../models/Order");

const findOrder = async (req, res, next) => {
  try {
    const order = await PendingOrder.findOne({
      "orderInfo.orderID": req.body.orderID,
    });

    if (order) {
      res.locals.order = order;
      next();
    } else {
      return res.json({
        success: false,
        message: "Order could not be found.",
      });
    }
  } catch (error) {
    showConsoleError("finding order", error);
    return res.json({
      success: false,
      message: caughtError("finding order", error, 99),
    });
  }
};

const setWasherDone = async (req, res) => {
  try {
    const order = res.locals.order;

    if (order.orderInfo.status === 3) {
      order.orderInfo.status = 4;

      await order.save();

      return res.json({
        success: true,
        message: "Order successfully marked as done.",
      });
    } else {
      return res.json({
        success: false,
        message: "Order has the incorrect status. Please contact us.",
      });
    }
  } catch (error) {
    showConsoleError("setting order as done by washer", error);
    return res.json({
      success: false,
      message: caughtError("setting order as done by washer", error, 99),
    });
  }
};

module.exports = { findOrder, setWasherDone };
