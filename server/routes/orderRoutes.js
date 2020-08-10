const {
    checkExistingOrder,
    countOrders,
    placeOrder,
    fetchOrders,
    getExistingOrder,
    cancelOrder,
    setDropoff,
    confirmReceived,
  } = require("../controllers/orderController"),
  express = require("express"),
  router = express.Router();

//todo: middleware for finding order like in driver + washer
//todo: error handling for when stuff doesnt exist when querying? like in findOrder @ driver

router.post("/placeOrder", checkExistingOrder, countOrders, placeOrder);
router.post("/fetchOrders", fetchOrders);
router.get("/getExistingOrder", getExistingOrder);
router.delete("/cancelOrder", cancelOrder);
router.put("/setDropoff", setDropoff);
router.put("/confirmReceived", confirmReceived);

module.exports = router;
