import { caughtError, showConsoleError } from "./errors";
import axios from "axios";
import jwtDecode from "jwt-decode";

const baseURL =
  process.env.NEXT_PUBLIC_BASE_URL || require("../../src/config").baseURL;

//to be used for fetching current user outside of SSR and initial page+children component mounting (in the case that the data may have changed after page load, for ex while user is afk or in another tab)
//usage: x = getCurrentUser, x.success
export const getCurrentUser = async () => {
  try {
    const response = await axios.get("/api/user/getCurrentUser", {
      withCredentials: true,
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

export const updateToken = () => {
  //deprecated
};

export const handleLogout = async () => {
  try {
    const response = await axios.post("/api/user/logout", {
      withCredentials: true,
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
