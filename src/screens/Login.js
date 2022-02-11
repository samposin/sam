import { useState, useEffect } from 'react'
import { Image } from 'semantic-ui-react';

import { connect } from 'react-redux'
import { initAuth, signInAuth2, signInBigQuery, quickSignIn, setLoginError } from '../actions/actions_user';
import LoginForm from '../components/LoginForm';
import { getCookie } from '../utils/components/Maps/layers';

function Login({ dispatch, auth2Loaded, googleUser, setCurrentRoute, bigQueryUser, login_error }) {

  const [ username, setUsername ] = useState('victor');
  const [ password, setPassword ] = useState('temprano');
  const [ loading, setLoading ] = useState(true)

  useEffect(()=>{
    if(login_error){
      setLoading(false)
    }
  },[login_error])

  useEffect(() => {
    dispatch(initAuth());
  }, [])

  useEffect(() => {
    if(auth2Loaded) {
      //we need this saved user and cookies to do a quick sign in
      var storedUserEntity = sessionStorage.getItem('autodirt-user-saved')
      
      if(storedUserEntity) {
        dispatch(quickSignIn(storedUserEntity))
      }
      else{
        setLoading(false)
      }
    }
  }, [auth2Loaded])

  useEffect(() => {
    if(googleUser && username && password) {
      dispatch(signInBigQuery(username, password))
    }
  }, [googleUser])

  useEffect(() => {
    if(bigQueryUser) {
      setCurrentRoute('map');
      setLoading(false)
    }
  }, [bigQueryUser])

  const doLogin = async (existingUser) => {
    if(!username){
      dispatch(setLoginError('Please provide a username.'))
    }
    else if(!password){
      dispatch(setLoginError('Please provide a password.'))

    }
    else {
      dispatch(signInAuth2());
      setLoading(true)
    }
  }

  return (
    <div className="login-screen">
    {
      loading ?
        <div style={{display:'flex', alignItems:'center', justifyContent:'center', height:'100vh'}}><h2>Loading...</h2></div>
      :
        <div style={{ textAlign : 'center' }}>
            <img src='./img/logo-peregrine-black.png' />
            <div className="login-panel">
                <LoginForm username={username} password={password} setUsername={setUsername} setPassword={setPassword} doLogin={doLogin} dispatch={dispatch} login_error={login_error} />
            </div>
        </div>
      }
    </div>

  );
}

const mapStateToProps = (state) => ({
  auth2Loaded : state.user.auth2Loaded,
  bigQueryUser : state.user.bigQueryUser,
  googleUser : state.user.googleUser,
  login_error : state.user.login_error
});

export default connect(mapStateToProps)(Login);
