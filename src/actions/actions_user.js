import { getBigQueryRequest } from "../utils/actions/helpers";

export const SET_AUTH2_LOADED = 'SET_AUTH2_LOADED';
export const SET_GOOGLE_USER = 'SET_GOOGLE_USER';
export const SET_BIGQUERY_USER = 'SET_BIGQUERY_USER';
export const SET_GOOGLE_PROFILE_IMAGE = 'SET_GOOGLE_PROFILE_IMAGE';
export const SET_LOGIN_ERROR = 'SET_LOGIN_ERROR';

// Set up google auth
const gapi = window.gapi;
var config = {
  'client_id': process.env.REACT_APP_GOOGLE_CLIENT_ID,
  'scope': 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/bigquery'
};
var auth2;

export function initAuth() {
  return (dispatch) => {
    return gapi.load('auth2', () => {
      gapi.auth2.init(config).then((e)=>{
        auth2 = e;
        if(auth2.isSignedIn.get()){
          const imageURL =  auth2.currentUser.get().getBasicProfile().getImageUrl()
          const email = auth2.currentUser.get().getBasicProfile().getEmail()
          dispatch(setGoogleProfileImage(imageURL, email))
        }
        else {
          //basically sign completely out we are probably missing cookies
          sessionStorage.clear()
          localStorage.clear()
          document.cookie = ''
        }
        
        gapi.client.load('bigquery', 'v2', ()=>{
          // console.log('bigquery ready')
          dispatch(setAuth2Loaded(true));
        })
      }).catch(error =>{
        console.log(error)
      })
    });
  }
}

export function setGoogleProfileImage(imageURL, email){
  return {
    type : SET_GOOGLE_PROFILE_IMAGE,
    payload : {imageURL, email}
  }
}

export function signInAuth2() {
  return (dispatch) => {
    return auth2.signIn().then(resp => {
      if(auth2.isSignedIn.get()){
        const imageURL =  auth2.currentUser.get().getBasicProfile().getImageUrl()
        const email = auth2.currentUser.get().getBasicProfile().getEmail()
        dispatch(setGoogleProfileImage(imageURL, email))
      }

      dispatch(setGoogleUser(resp));
    }).catch(error =>{
      dispatch(setLoginError("Google authentication error. Please try again."))
    })
  }
}

export function signInBigQuery(username, password) {

  return (dispatch) => {
    const savedSession = sessionStorage.getItem('autodirt-user-saved')
    sessionStorage.clear()
    const query = 'Select pk FROM `land.login` WHERE username = \'' + username + '\' and password = \'' + password + '\';'
    const request = getBigQueryRequest(query);

    return request.execute(resp => {
      if(resp.code || resp.result.totalRows === "0") {
        dispatch(setLoginError("Invalid username or password."))
        dispatch(setGoogleUser(false))
        sessionStorage.clear()
      }
      else {
        var pk = resp.result.rows[0].f[0].v;
        let date = new Date();
        date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
        sessionStorage.setItem('autodirt-user-saved', savedSession)
        const expires = "expires=" + date.toUTCString();
        document.cookie = "pk=" + pk + "; " + expires + ";";
        dispatch(setBigQueryUser(true));
      }
    
    });
  }
}

export function quickSignIn(userEntity) {
  return (dispatch) => {
    return gapi.client.init(userEntity).then(resp => {
      dispatch(setBigQueryUser(true));
    });
  }
}

export function setGoogleUser(userObject) {
  return {
    type : SET_GOOGLE_USER,
    payload : userObject
  }
}

export function setBigQueryUser(payload) {
  return {
    type : SET_BIGQUERY_USER,
    payload : payload
  }
}

export function setAuth2Loaded(payload) {
  return {
    type : SET_AUTH2_LOADED,
    payload : payload
  }
}

export function setLoginError(errorMSG) {
  return {
    type : SET_LOGIN_ERROR,
    payload : errorMSG
  }
}
