const { showConsoleError, caughtError } = require("../helpers/errors");
const { signToken } = require("../helpers/authorization");
const User = require("../models/User");

const stripeSECRET =
  process.env.STRIPE_SECRET || require("../config/config").stripe.secret;
const stripe = require("stripe")(stripeSECRET);

const checkDuplicate = async (req, res) => {
  try {
    const emailUser = await User.findOne({
      email: req.body.email.toLowerCase(),
    });
    const phoneUser = await User.findOne({ phone: req.body.phone });

    //0: none, 1: email, 2: phone, 3: both
    if (emailUser && phoneUser) {
      return res.json({ success: true, message: 3 });
    } else if (emailUser) {
      return res.json({ success: true, message: 1 });
    } else if (phoneUser) {
      return res.json({ success: true, message: 2 });
    } else {
      return res.json({ success: true, message: 0 });
    }
  } catch (error) {
    showConsoleError("checking for duplicate email and phone", error);
    return res.json({
      success: false,
      message: caughtError("checking for duplicate email and phone", error, 99),
    });
  }
};

const register = async (req, res) => {
  try {
    const stripeCustomer = await stripe.customers.create({
      email: req.body.email,
    });

    const user = await User.create({
      email: req.body.email,
      fname: req.body.fname,
      lname: req.body.lname,
      city: req.body.city,
      phone: req.body.phone,
      password: req.body.password,
      usedReferral: req.body.referral,
      isWasher: false,
      isDriver: false,
      isAdmin: false,
      stripe: {
        regPaymentID: "N/A",
        customerID: customer.id,
      },
      subscription: {
        id: "N/A",
        anchorDate: "N/A",
        startDate: "N/A",
        periodStart: "N/A",
        periodEnd: "N/A",
        plan: "N/A",
        status: "N/A",
        lbsLeft: 0,
      },
    });

    if (user) {
      return res.json({
        success: true,
        message:
          "You've successfully registered! Welcome to the Laundr family. Please log in to continue.",
      });
    }
  } catch (error) {
    showConsoleError("creating user", error);
    return res.json({
      success: false,
      message: caughtError("creating user", error, 99),
    });
  }
};

const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user || !user.validPassword(req.body.password)) {
      return res.json({
        success: false,
        message: "Invalid login. Please try again.",
      });
    } else {
      //granting access to the token, the information for current user
      const token = await signToken(user);

      return res.json({
        success: true,
        message: "Successfully logged in, token is attached.",
        token: token,
      });
    }
  } catch (error) {
    showConsoleError("logging in", error);
    return res.json({
      success: false,
      message: caughtError("logging in", error, 99),
    });
  }
};

const updateToken = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.query.email });

    if (user) {
      const token = await signToken(user);

      return res.json({
        success: true,
        message: "Token is attached.",
        token: token,
      });
    } else {
      return res.json({
        success: false,
        message:
          "Error with updating token: user could not be found. Please try again.",
      });
    }
  } catch (error) {
    showConsoleError("updating token", error);
    return res.json({
      success: false,
      message: caughtError("updating token", error, 99),
    });
  }
};

module.exports = { checkDuplicate, register, login, updateToken };
