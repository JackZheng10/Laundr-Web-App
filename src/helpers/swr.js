import { caughtError, showConsoleError } from "./errors";
import axios from "axios";

export const GET_SWR = async (url, params) => {
  try {
    const response = await axios.get(url, {
      params: params ? JSON.parse(params) : {},
      withCredentials: true,
    });

    //if success was false and it wasn't due to not being logged in
    if (!response.data.success && !response.data.redirect) {
      const error = new Error(response.data.message);
      throw error;
    } else {
      return response;
    }
  } catch (err) {
    showConsoleError("processing request", err);
    console.log(err);
    const error = new Error(caughtError("processing request", err, 99));
    throw error;
  }
};

//filter used to fetch orders
export const getFilterConfig = (currentUser, window) => {
  const path = window.location.pathname;
  console.log(path);

  switch (path) {
    case "/account/history":
      if (currentUser.isDriver) {
        return "orderHistoryDriver";
      } else if (currentUser.isWasher) {
        return "orderHistoryWasher";
      } else {
        return "orderHistoryUser";
      }

    case "/washer/assigned":
      return "washerAssigned";

    case "/driver/accepted":
      return "driverAccepted";

    case "/driver/available":
      return "none";
  }
};

export const hasPageAccess = (currentUser, window) => {
  const urlSections = window.location.pathname.split("/");

  switch (urlSections[1]) {
    case "user":
      if (currentUser.isDriver || currentUser.isWasher || currentUser.isAdmin) {
        return false;
      }
      break;

    case "washer":
      if (!currentUser.isWasher) {
        return false;
      }
      break;

    case "driver":
      if (!currentUser.isDriver) {
        return false;
      }
      break;

    case "admin":
      if (!currentUser.isAdmin) {
        return false;
      }
      break;

    case "account":
      if (currentUser.isAdmin) {
        return false;
      }
      break;
  }

  return true;
};
