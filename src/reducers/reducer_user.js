import {
  SET_AUTH2_LOADED,
  SET_GOOGLE_USER,
  SET_BIGQUERY_USER,
  SET_GOOGLE_PROFILE_IMAGE,
  SET_LOGIN_ERROR
} from '../actions/actions_user'

const user = (state = {
  auth2Loaded : false,
  googleUser : false,
  bigQueryUser : false,
  google_image_url: false,
  login_error: false,
  first_name: false,
  user_email: false,
}, action) => {
  switch (action.type) {
    case SET_AUTH2_LOADED:
      return {
        ...state,
        auth2Loaded : action.payload
      };
    case SET_GOOGLE_USER:
      sessionStorage.setItem('autodirt-user-saved',JSON.stringify(action.payload));
      return {
        ...state,
        googleUser : action.payload
      };
    case SET_BIGQUERY_USER:
      return {
        ...state,
        bigQueryUser : action.payload
      };
    case SET_GOOGLE_PROFILE_IMAGE:
      return {
        ...state,
        google_image_url : action.payload.imageURL,
        user_email: action.payload.email
      };
    case SET_LOGIN_ERROR:
      return {
        ...state,
        login_error : action.payload
      };
    default:
      return state
  }
}

export default user
