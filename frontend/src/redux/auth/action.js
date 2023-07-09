import axios from "../../interceptor/axios";
import { authLoading, authLoadingFinish, authError } from "../authError/action";
import toast from "react-hot-toast";

export const AUTH_ERROR_EXPIRED = "AUTH_ERROR_EXPIRED";
export const AUTH_SUCCESS_API_LOGIN = "AUTH_SUCCESS_API_LOGIN";
export const AUTH_SUCCESS_API_ME = "AUTH_SUCCESS_API_ME";
export const AUTH_LOGOUT = "AUTH_LOGOUT";

export const loginApi = (payload) => {
  return async (dispatch) => {
    dispatch(authLoading());
    try {
      let response = await axios.post("/auth/login", payload);

      dispatch(authSuccessApiLogin(response.data));

      dispatch(authLoadingFinish());

      dispatch(meApi());
    } catch (error) {
      dispatch(authError(error.response.data.errors));
    }
  };
};

export const meApi = () => {
  return async (dispatch) => {
    dispatch(authLoading());
    try {
      let response = await axios.get("/auth/me");

      dispatch(authSuccessApiMe(response.data.data));
    } catch (error) {
      dispatch(authErrorExpired(error.response.data));
    }
  };
};

export const logoutApi = () => {
  return async (dispatch) => {
    try {
      await axios.delete("/auth/logout");

      dispatch(authLogout());

      toast.success("Anda berhasil logout", {
        position: "top-right",
        duration: 2000,
        iconTheme: {
          primary: "#1bff1f",
          secondary: "#000000",
        },
        style: {
          borderRadius: "10px",
          background: "#1bff23",
          color: "#000000",
        },
      });
    } catch (error) {
      dispatch(authErrorExpired(error.response));
    }
  };
};

export const authSuccessApiLogin = (payload) => {
  return {
    type: AUTH_SUCCESS_API_LOGIN,
    payload,
  };
};

export const authSuccessApiMe = (payload) => {
  return {
    type: AUTH_SUCCESS_API_ME,
    payload,
  };
};

export const authLogout = () => {
  return {
    type: AUTH_LOGOUT,
  };
};

export const authErrorExpired = (payload) => {
  return {
    type: AUTH_ERROR_EXPIRED,
    payload,
  };
};
