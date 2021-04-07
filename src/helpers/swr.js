import { caughtError, showConsoleError } from "./errors";
import axios from "axios";

//second parameter is whether to retrieve the balance or not
// export const getCurrentUser_SWR = async (url, balance) => {
//   try {
//     const response = await axios.get(url, {
//       params: {
//         balance,
//       },
//       withCredentials: true,
//     });

//     //if success was false and it wasn't due to not being logged in
//     if (!response.data.success && !response.data.redirect) {
//       const error = new Error(response.data.message);
//       throw error;
//     } else {
//       return response;
//     }
//   } catch (err) {
//     showConsoleError("fetching current user", err);
//     const error = new Error(caughtError("fetching current user", err, 99));
//     throw error;
//   }
// };

export const GET_SWR = async (url, params) => {
  try {
    const response = await axios.get(url, {
      params: JSON.parse(params),
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
    const error = new Error(caughtError("processing request", err, 99));
    throw error;
  }
};
