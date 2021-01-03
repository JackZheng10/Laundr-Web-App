import { caughtError, showConsoleError } from "./errors";
import axios from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_BASE_URL || require("../../src/config").baseURL;

//test with cookies disabled (context.req is undefined) to see if null works

//general - used to fetch current user in getServerSideProps - can be used for further data fetching, authorization etc.
export const getCurrentUser_SSR = async (context) => {
  try {
    const response = await axios.get(`${baseURL}/api/user/getCurrentUser`, {
      headers: context.req.headers.cookie
        ? { cookie: context.req.headers.cookie }
        : null,
    });

    return response;
  } catch (error) {
    showConsoleError("fetching current user", error);
    return {
      data: {
        success: false,
        message: caughtError("fetching current user", error, 99),
      },
    };
  }
};

//user - dashboard
export const getExistingOrder_SSR = async (context, currentUser) => {
  try {
    const response = await axios.get(`${baseURL}/api/order/getExistingOrder`, {
      headers: context.req.headers.cookie
        ? { cookie: context.req.headers.cookie }
        : null,
    });

    if (response.data.success) {
      let componentName;

      if (response.data.message === "N/A") {
        if (currentUser.stripe.regPaymentID === "N/A") {
          componentName = "set_payment";
        } else {
          componentName = "new_order";
        }
      } else {
        componentName = "order_status";
      }

      //message = user object
      return {
        data: {
          success: true,
          componentName: componentName,
          message: response.data.message,
        },
      };
    } else {
      return response;
    }
  } catch (error) {
    showConsoleError("fetching order info", error);
    return {
      data: {
        success: false,
        message: caughtError("fetching order info", error, 99),
      },
    };
  }
};

//washer - assigned
export const fetchOrders_WA_SSR = async (context, currentUser) => {
  try {
    const response = await axios.post(
      `${baseURL}/api/order/fetchOrders`,
      {
        filter: "washerAssigned",
      },
      {
        headers: context.req.headers.cookie
          ? { cookie: context.req.headers.cookie }
          : null,
      }
    );

    return response;
  } catch (error) {
    showConsoleError("fetching orders", error);
    return {
      data: {
        success: false,
        message: caughtError("fetching orders", error, 99),
      },
    };
  }
};

//driver - available
export const fetchOrders_DAV_SSR = async (context, currentUser) => {
  try {
    const response = await axios.post(
      `${baseURL}/api/order/fetchOrders`,
      {
        filter: "none",
        statuses: [0, 4],
      },
      {
        headers: context.req.headers.cookie
          ? { cookie: context.req.headers.cookie }
          : null,
      }
    );

    return response;
  } catch (error) {
    showConsoleError("fetching orders", error);
    return {
      data: {
        success: false,
        message: caughtError("fetching orders", error, 99),
      },
    };
  }
};

//driver - accepted
export const fetchOrders_DAC_SSR = async (context, currentUser) => {
  try {
    const response = await axios.post(
      `${baseURL}/api/order/fetchOrders`,
      {
        filter: "driverAccepted",
      },
      {
        headers: context.req.headers.cookie
          ? { cookie: context.req.headers.cookie }
          : null,
      }
    );

    return response;
  } catch (error) {
    showConsoleError("fetching orders", error);
    return {
      data: {
        success: false,
        message: caughtError("fetching orders", error, 99),
      },
    };
  }
};

//account - history
export const fetchOrderHistory_SSR = async (context, currentUser) => {
  try {
    let filter;

    if (currentUser.isDriver) {
      filter = "orderHistoryDriver";
    } else if (currentUser.isWasher) {
      filter = "orderHistoryWasher";
    } else {
      filter = "orderHistoryUser";
    }

    const response = await axios.post(
      `${baseURL}/api/order/fetchOrders`,
      {
        filter: filter,
      },
      {
        headers: context.req.headers.cookie
          ? { cookie: context.req.headers.cookie }
          : null,
      }
    );

    return response;
  } catch (error) {
    showConsoleError("fetching orders", error);
    return {
      data: {
        success: false,
        message: caughtError("fetching orders", error, 99),
      },
    };
  }
};

//account - details
export const fetchCardDetails_SSR = async (context, currentUser) => {
  try {
    const response = await axios.post(
      `${baseURL}/api/stripe/getCardDetails`,
      {
        paymentID: currentUser.stripe.regPaymentID,
      },
      {
        headers: context.req.headers.cookie
          ? { cookie: context.req.headers.cookie }
          : null,
      }
    );

    return response;
  } catch (error) {
    showConsoleError("fetching card details", error);
    return {
      data: {
        success: false,
        message: caughtError("fetching card details", error, 99),
      },
    };
  }
};

//when doing authorization, pay attention to if youre using userid from body/query or the authentication part...
