import { caughtError, showConsoleError } from "./errors";
import axios from "axios";
import jwtDecode from "jwt-decode";

const baseURL =
  process.env.NEXT_PUBLIC_BASE_URL || require("../../src/config").baseURL;

export const getCurrentUser = async () => {
  try {
    const response = await axios.get(`${baseURL}/api/user/getCurrentUser`);

    if (response.data.success) {
      return { success: true, message: response.data.message };
    } else {
      return {
        success: false,
        redirect: response.data.redirect,
        message: response.data.message,
      };
    }
  } catch (error) {
    showConsoleError("fetching current user", error);
    return {
      success: false,
      message: caughtError("fetching current user", error, 99),
    };
  }
};

export const getCurrentUser_SSR = async (context) => {
  try {
    const response = await axios.get(`${baseURL}/api/user/getCurrentUser`, {
      headers: context.req ? { cookie: context.req.headers.cookie } : undefined,
    });

    return response.data;
  } catch (error) {
    showConsoleError("fetching current user", error);
    return {
      success: false,
      message: caughtError("fetching current user", error, 99),
    };
  }
};

//todo: maybe use phone
export const updateToken = async (userEmail) => {
  try {
    const response = await axios.get("/api/user/updateToken", {
      params: {
        email: userEmail,
      },
    });

    if (response.data.success) {
      const token = response.data.token;
      localStorage.setItem("token", token);
    } else {
      alert(response.data.message);
    }
  } catch (error) {
    showConsoleError("updating token", error);
    alert(caughtError("updating token", error, 99));
  }
};
