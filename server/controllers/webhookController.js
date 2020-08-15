const { showConsoleError, caughtError } = require("../helpers/errors");
const User = require("../models/User");
const moment = require("moment");

const stripeSECRET =
  process.env.STRIPE_SECRET || require("../config/config").stripe.secret;

const stripe = require("stripe")(stripeSECRET);

const familyAPI_ID =
  process.env.STRIPE_FAMILY_API_ID ||
  require("../config/config").stripe.familyAPI_ID;
const plusAPI_ID =
  process.env.STRIPE_PLUS_API_ID ||
  require("../config/config").stripe.plusAPI_ID;
const standardAPI_ID =
  process.env.STANDARD_FAMILY_API_ID ||
  require("../config/config").stripe.standardAPI_ID;
const studentAPI_ID =
  process.env.STUDENT_FAMILY_API_ID ||
  require("../config/config").stripe.studentAPI_ID;

//todo: use webhooks to handle email change in chckout
//todo: along w/restructuring get/post/put/etc., also: https://www.google.com/search?ei=y3QFX9veN-uxgge4qZ3oAQ&q=stripe+error+handling+node&oq=stripe+error+handling+node&gs_lcp=CgZwc3ktYWIQAzICCAAyAggAOgUIABCRAjoECAAQQzoICAAQsQMQgwE6BQgAELEDOgcIABCxAxBDOgsIABCxAxCDARCRAjoECAAQCjoGCAAQFhAeUMcTWK8uYI4vaABwAHgAgAFciAGPD5IBAjI2mAEAoAEBqgEHZ3dzLXdpeg&sclient=psy-ab&ved=0ahUKEwib8LGLkL3qAhXrmOAKHbhUBx0Q4dUDCAw&uact=5
//todo: caughtError inclusion

const handleWebhook = async (req, res) => {
  let event;

  try {
    event = JSON.parse(req.body);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === "invoice.payment_succeeded") {
    //when sub cycle payment succeeds - since invoices only used for subs. also applies for initial purchase
    console.log("\x1b[32m%s\x1b[0m", "Event handled: " + event.type); //green
    const invoice = event.data.object;

    try {
      //todo: maybe customer ID can be inside this and dont need to retrieve subscription
      //todo: what to do about changed email in checkout...
      const subscriptionID = invoice.subscription;

      const subscription = await stripe.subscriptions.retrieve(subscriptionID);

      //create the new sub object from the updated subscription
      let plan;
      let lbsLeft;

      switch (successfulSubscription.plan.id) {
        case familyAPI_ID:
          plan = "Family";
          lbsLeft = 84;
          break;
        case plusAPI_ID:
          plan = "Plus";
          lbsLeft = 66;
          break;
        case standardAPI_ID:
          plan = "Standard";
          lbsLeft = 48;
          break;
        case studentAPI_ID:
          plan = "Student";
          lbsLeft = 40;
          break;
      }

      const updatedSubscription = {
        id: successfulSubscription.id,
        anchorDate: moment
          .unix(successfulSubscription.billing_cycle_anchor)
          .format(),
        startDate: moment.unix(successfulSubscription.start_date).format(),
        periodStart: moment
          .unix(successfulSubscription.current_period_start)
          .format(),
        periodEnd: moment
          .unix(successfulSubscription.current_period_end)
          .format(),
        plan: plan,
        status: successfulSubscription.status,
        lbsLeft: lbsLeft,
      };

      //update user's "subscription" property with the updated sub object
      const user = await User.findOneAndUpdate(
        { "stripe.customerID": subscription.customer },
        { subscription: updatedSubscription }
      );

      return res.json({
        success: true,
        message: "Subscription successfully updated.",
      });
    } catch (error) {
      showConsoleError("handling successful invoice payment", error);
      return res.json({
        success: false,
        message: `Error with handling successful invoice payment: ${error}`,
      });
    }
  } else if (event.type === "invoice.payment_failed") {
    //when sub cycle payment fails - since invoices only used for subs, todo
    console.log("\x1b[32m%s\x1b[0m", "Event handled: " + event.type); //green

    return res.json({
      success: false,
      message: "Event not handled (yet)",
    });
  } else if (event.type === "customer.subscription.deleted") {
    //when sub cancelled by you or them via their self-service portal
    console.log("\x1b[32m%s\x1b[0m", "Event handled: " + event.type); //green

    const cancelledSubscription = event.data.object;

    try {
      const user = await User.findOneAndUpdate(
        { "stripe.customerID": cancelledSubscription.customer },
        { "subscription.status": "cancelled" }
      );

      return res.json({
        success: true,
        message: "Subscription successfully cancelled.",
      });
    } catch (error) {
      showConsoleError("cancelling subscription", error);
      return res.json({
        success: false,
        message: `Error with cancelling subscription: ${error}`,
      });
    }
  } else {
    //unexpected event type or one not handled
    console.log("\x1b[31m%s\x1b[0m", "Event NOT handled: " + event.type); //red

    return res.json({
      success: false,
      message: "Event not handled (yet)",
    });
  }
};

module.exports = { handleWebhook };

// console.log(
//   "test 1: " +
//     moment.unix(subscription.billing_cycle_anchor).format()
// ); //iso8601

// console.log(
//   "test 2: " + moment.unix(subscription.billing_cycle_anchor)
// ); //moment object, basically a Date

// console.log(
//   "this 1: " +
//     moment
//       .unix(subscription.billing_cycle_anchor)
//       .format("HH:mm:ss")
// );
// console.log(
//   "this 2: " +
//     moment
//       .unix(subscription.billing_cycle_anchor)
//       .format("MM/DD/YYYY")
// ); //format("MM/DD/YYYY");

// switch (event.type) {
//   case "invoice.payment_succeeded":
//     /*==================================================================*/
//     //when sub cycle payment succeeds - since invoices only used for subs. also applies for first one
//     console.log("Event handled: " + event.type);
//     const invoice = event.data.object;

//     let subscriptionID = invoice.subscription;
//     let successfulSubscription;
//     let retrievalError = false;

//     //retrieve associated sub
//     await stripe.subscriptions
//       .retrieve(subscriptionID)
//       .then((subscription, err) => {
//         if (err || !subscription) {
//           retrievalError = true;
//         } else {
//           successfulSubscription = subscription;
//         }
//       });

//     if (retrievalError) {
//       return res.json({
//         success: false,
//         message: "Could not fetch subscription",
//       });
//     }

//     //create the new sub object from the updated subscription
//     let plan;
//     let lbsLeft;

//     switch (successfulSubscription.plan.id) {
//       case familyAPI_ID:
//         plan = "Family";
//         lbsLeft = 84;
//         break;
//       case plusAPI_ID:
//         plan = "Plus";
//         lbsLeft = 66;
//         break;
//       case standardAPI_ID:
//         plan = "Standard";
//         lbsLeft = 48;
//         break;
//       case studentAPI_ID:
//         plan = "Student";
//         lbsLeft = 40;
//         break;
//     }

//     let updatedSubscription = {
//       id: successfulSubscription.id,
//       anchorDate: moment
//         .unix(successfulSubscription.billing_cycle_anchor)
//         .format(),
//       startDate: moment.unix(successfulSubscription.start_date).format(),
//       periodStart: moment
//         .unix(successfulSubscription.current_period_start)
//         .format(),
//       periodEnd: moment
//         .unix(successfulSubscription.current_period_end)
//         .format(),
//       plan: plan,
//       status: successfulSubscription.status,
//       lbsLeft: lbsLeft,
//     };

//     //update user's "subscription" property with the updated sub object
//     await User.findOneAndUpdate(
//       { "stripe.customerID": successfulSubscription.customer },
//       { subscription: updatedSubscription }
//     )
//       .then((user) => {
//         if (user) {
//           return res.json({
//             success: true,
//             message: "Updated user subscription object",
//           });
//         } else {
//           return res.json({
//             success: false,
//             message: "Could not find user associated with subscription",
//           });
//         }
//       })
//       .catch((error) => {
//         return res.json({
//           success: false,
//           message: error,
//         });
//       });
//     /*==================================================================*/
//     break;

//   case "invoice.failed":
//     /*==================================================================*/
//     //when sub cycle payment fails - since invoices only used for subs
//     console.log("Event handled: " + event.type);

//     return res.json({
//       success: false,
//       message: "Event not handled",
//     });
//     /*==================================================================*/
//     break;

//   case "customer.subscription.deleted":
//     /*==================================================================*/
//     //when sub cancelled by you or them via their self-service portal
//     console.log("Event handled: " + event.type);

//     let cancelledSubscription = event.data.object;

//     await User.findOneAndUpdate(
//       { "stripe.customerID": cancelledSubscription.customer },
//       { "subscription.status": "cancelled", "subscription.lbsLeft": 0 }
//     )
//       .then((user) => {
//         if (user) {
//           return res.json({
//             success: true,
//             message: "Updated user subscription object",
//           });
//         } else {
//           return res.json({
//             success: false,
//             message: "Could not find user associated with subscription",
//           });
//         }
//       })
//       .catch((error) => {
//         return res.json({
//           success: false,
//           message: error,
//         });
//       });
//     /*==================================================================*/
//     break;

//   default:
//     /*==================================================================*/
//     //unexpected event type or one not handled
//     console.log("Event NOT handled: " + event.type);
//     return res.json({
//       success: false,
//       message: "Event not handled",
//     });
//     /*==================================================================*/
//     break;
// }
