import { caughtError, showConsoleError } from "./errors";
import axios from "axios";
import jwtDecode from "jwt-decode";

export const getCurrentUser = () => {
  if (typeof localStorage !== "undefined") {
    const token = localStorage.getItem("token");

    if (token !== null) {
      const data = jwtDecode(token);
      //todo: verify the token beforehand
      return data;
    } else {
      //todo: maybe something else to handle this null return. depends on the context this is usually used in
      //todo: possible combine w/getStored by returning object with property and token
      alert("Error with retrieving current user. Please relog and try again.");
      return null;
    }
  } else {
    //todo: will change when switch to cookies
    console.log(
      "Error with retrieving current user. Please make sure localStorage is enabled."
    );
    return null;
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
