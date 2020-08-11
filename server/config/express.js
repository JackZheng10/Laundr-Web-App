const path = require("path"),
  express = require("express"),
  mongoose = require("mongoose"),
  morgan = require("morgan"),
  bodyParser = require("body-parser"),
  twilioRoutes = require("../routes/twilioRoutes"),
  userRoutes = require("../routes/userRoutes"),
  orderRoutes = require("../routes/orderRoutes"),
  driverRoutes = require("../routes/driverRoutes"),
  washerRoutes = require("../routes/washerRoutes"),
  stripeRoutes = require("../routes/stripeRoutes"),
  webhookRoutes = require("../routes/webhookRoutes"),
  cors = require("cors");

module.exports.init = () => {
  //connect to db
  mongoose.connect(process.env.DB_URI || require("./config").db.uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });

  //initialize app
  const app = express();

  app.use(cors());

  //morgan used for logging HTTP requests to the console
  app.use(morgan("dev"));

  //add routes for stripe webhooks before bodyparser is used, error if put with other routes
  app.use("/webhook", webhookRoutes);

  //bodyParser middleware used for resolving the req and res body objects (urlEncoded and json formats)
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  const connection = mongoose.connection;
  connection.once("open", () => {
    console.log("MongoDB database connected");
  });
  connection.on("error", (error) => console.log("Error: " + error));

  //add routers
  app.use("/api/twilio", twilioRoutes);
  app.use("/api/user", userRoutes);
  app.use("/api/order", orderRoutes);
  app.use("/api/driver", driverRoutes);
  app.use("/api/washer", washerRoutes);
  app.use("/api/stripe", stripeRoutes);

  //todo: add change stream to move order to proper collection if you change the status manually - maybe not necessary if done through admin panel

  return app;
};
