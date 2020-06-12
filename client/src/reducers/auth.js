import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  loading: true,
  user: null,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
      return {
        //returns the following to App state
        ...state,
        isAuthenticated: true,
        loading: false,
        //user is the data from our payload
        user: payload,
      };
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      //set 'token' in our local Storage and App state to be the value of token from our payload that came as part of our action. In this case payload looks like payload:{token: ... }
      //note we set 'token' in local storage to be our logged in user's token, but this isn't actually in our header. (In other words this seems to be an intermediate step before we can actually use our token so that we can check if it actually exists)
      localStorage.setItem("token", payload.token);

      //to our App state we return the following
      return {
        ...state,
        ...payload, //adds everything in our payload to state which is just payload: {token: ...} in this case so only token gets added
        isAuthenticated: true,
        loading: false,
      };
    case LOGOUT:
    case LOGIN_FAIL:
    case REGISTER_FAIL:
    case AUTH_ERROR:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    default:
      return state;
  }
}
