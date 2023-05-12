import {
  AUTH_LOADING,
  AUTH_ERROR,
  AUTH_SUCCESS_API_LOGIN,
  AUTH_SUCCESS_API_ME,
  AUTH_LOGOUT,
  AUTH_ERROR_DELETE,
  AUTH_ERROR_EXPIRED,
} from "./action";

const authInitialState = {
  user: null,
  isLoading: false,
  isError: null,
};

const initialState = {
  ...authInitialState,
  action: "",
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_LOADING:
      return {
        ...state,
        action: action.type,
        isLoading: true,
      };
    case AUTH_ERROR:
      return {
        ...state,
        action: action.type,
        isLoading: false,
        isError: action.payload,
      };
    case AUTH_ERROR_DELETE:
      return {
        ...state,
        action: action.type,
        isLoading: false,
        isError: null,
      };
    case AUTH_ERROR_EXPIRED:
      return {
        ...state,
        user: null,
        action: action.type,
        isLoading: false,
      };
    case AUTH_SUCCESS_API_LOGIN:
      return {
        ...state,
        user: action.payload.data,
        action: action.type,
        isLoading: false,
        isError: null,
      };
    case AUTH_SUCCESS_API_ME:
      return {
        ...state,
        action: action.type,
        isLoading: false,
        isError: null,
        user: action.payload,
      };
    case AUTH_LOGOUT:
      return {
        user: null,
        isLoading: false,
        isError: null,
      };
    default:
      return state;
  }
};

export default authReducer;
