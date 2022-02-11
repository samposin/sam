import { Form, Icon, Message } from "semantic-ui-react";
import { setLoginError } from "../actions/actions_user";

export default function LoginForm({username, password, setUsername, setPassword, doLogin, login_error, dispatch}){

    return(
        <Form onSubmit={() => doLogin()}>
             {/* {login_error && <Message negative >
                <p>{login_error}</p>
            </Message>}
            <Form.Field>
            <label>Username</label>
            <input placeholder='Username'  value={username} onChange={(e) => {dispatch(setLoginError(false)); setUsername(e.target.value);}}/>
            </Form.Field>
            <Form.Field>
            <label>Password</label>
            <input placeholder='Password' type="password"  value={password} onChange={(e) => {dispatch(setLoginError(false)); setPassword(e.target.value)}}/>
            </Form.Field> */}
            <button className="atd-button"  type='submit'><div className="icon"><img src='./img/icons/google-icon.png' alt="google" /></div><div className="label">Sign in with Google</div></button>
        </Form>
    )
}
