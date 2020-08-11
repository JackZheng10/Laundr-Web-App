const { showConsoleError, caughtError } = require("../helpers/errors");
const { PendingOrder, CompletedOrder } = require("../models/Order");

//RETURNS ONLY TERMINATE THE CURRENT FUNCTION YOU DUMMY: aka the .then, catc, etc.
//awaiting on a promise guarantees the .then is executed right after

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

//initial pickup
const assignOrderPickup = async (req, res) => {
  try {
    const order = res.locals.order;

    if (order.pickupInfo.driverEmail === "N/A") {
      order.orderInfo.status = 1;
      order.pickupInfo.driverEmail = req.body.driverEmail;

      await order.save();

      return res.json({
        success: true,
        message: "Order successfully accepted.",
      });
    } else {
      return res.json({
        success: false,
        message: "Order already has a pickup driver.",
      });
    }
  } catch (error) {
    showConsoleError("assigning initial pickup driver", error);
    return res.json({
      success: false,
      message: caughtError("assigning initial pickup driver", error, 99),
    });
  }
};

const enterOrderWeight = async (req, res) => {
  try {
    const order = res.locals.order;

    if (order.orderInfo.weight === "N/A") {
      order.orderInfo.status = 2;
      order.orderInfo.weight = req.body.weight;

      await order.save();

      return res.json({
        success: true,
        message: "Weight successfully entered.",
      });
    } else {
      return res.json({
        success: false,
        message: "Order already has a weight entered",
      });
    }
  } catch (error) {
    showConsoleError("entering order weight", error);
    return res.json({
      success: false,
      message: caughtError("entering order weight", error, 99),
    });
  }
};

const setWasherDelivered = async (req, res) => {
  try {
    const order = res.locals.order;

    if (order.orderInfo.status === 2) {
      order.orderInfo.status = 3;

      await order.save();

      return res.json({
        success: true,
        message: "Successfully confirmed delivery to washer.",
      });
    } else {
      return res.json({
        success: false,
        message: "Order has the incorrect status. Please contact us.",
      });
    }
  } catch (error) {
    showConsoleError("confirming washer delivery", error);
    return res.json({
      success: false,
      message: caughtError("confirming washer delivery", error, 99),
    });
  }
};

const assignOrderDropoff = async (req, res) => {
  try {
    const order = res.locals.order;

    if (order.dropoffInfo.driverEmail === "N/A") {
      order.orderInfo.status = 5;
      order.dropoffInfo.driverEmail = req.body.driverEmail;

      await order.save();

      return res.json({
        success: true,
        message: "Order for final dropoff successfully accepted.",
      });
    } else {
      return res.json({
        success: false,
        message: "Order already has a dropoff driver.",
      });
    }
  } catch (error) {
    showConsoleError("assigning final dropoff driver", error);
    return res.json({
      success: false,
      message: caughtError("assigning final dropoff driver", error, 99),
    });
  }
};

const setUserDelivered = async (req, res) => {
  try {
    const order = res.locals.order;

    if (order.dropoffInfo.date === "N/A" && order.dropoffInfo.time === "N/A") {
      return res.json({
        success: false,
        message:
          "Order cannot be delivered until user has scheduled a dropoff time. If this is a mistake, please contact us.",
      });
    }

    if (order.orderInfo.status === 5) {
      order.orderInfo.status = 6;

      await order.save();

      return res.json({
        success: true,
        message: "Order successfully marked as delivered to user.",
      });
    } else {
      return res.json({
        success: false,
        message: "Order has the incorrect status. Please contact us.",
      });
    }
  } catch (error) {
    showConsoleError("marking as delivered to user", error);
    return res.json({
      success: false,
      message: caughtError("marking as delivered to user", error, 99),
    });
  }
};

module.exports = {
  findOrder,
  assignOrderPickup,
  enterOrderWeight,
  setWasherDelivered,
  assignOrderDropoff,
  setUserDelivered,
};
