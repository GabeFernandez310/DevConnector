import axios from "axios";
import { setAlert } from "./alert";
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
} from "./types";
import setAuthToken from "../utils/setAuthToken";

//Load user
export const loadUser = () => async (dispatch) => {
  //if a token exists in local storage (put in local storage by Register or Login),
  // set the default header value for x-auth-token for all http requests sent from axios to be the token in local storage)
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    //attempt to send a get request to /api/auth route (this works because we set a proxy in our json for the default root location to reference from and set up routes in our App.js)
    // Stores returned value from get request in 'res'. The returned value is all the user info stored in the database minus the password. This was authenticated using our auth middleware which used our token we set using setAuthToken();
    const res = await axios.get("/api/auth");

    //call USER_LOADED in reducers
    dispatch({
      type: USER_LOADED,
      //payload is our returned user object from our database
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

//Register User
export const register = ({ name, email, password }) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ name, email, password });

  try {
    //attempts to register user in back-end and returns their info
    const res = await axios.post("/api/users", body, config);

    //triggers REGISTER_SUCCESS action, therefore adding App state in redux as specified by the reducer
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });
    //Triggers loadUser() above
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      //for each error found in our errors array returned from the back-end, dispatch a setAlert with the relevant data
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

//Login User
export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ email, password });

  try {
    //signs up user and returns their token
    const res = await axios.post("/api/auth", body, config);

    //Trigger the LOGIN_SUCCESS in reducer
    dispatch({
      type: LOGIN_SUCCESS,
      //payload accesses and sends all data in our response json. This is only our token in this case so payload:{token: ... }
      payload: res.data,
    });

    //run loadUser() above
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      //for each error found in our errors array returned from the back-end, dispatch a setAlert with the relevant data
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};
