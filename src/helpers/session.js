import { caughtError, showConsoleError } from "./errors";
import axios from "../helpers/axios";

//to be used for fetching current user outside of SSR and initial page+children component mounting (in the case that the data may have changed after page load, for ex while user is afk or in another tab)
//should rarely be used
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
    const response = await axios.post(
      "/api/user/logout",
      {},
      {
        withCredentials: true,
      }
    );

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
