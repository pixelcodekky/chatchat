import React from 'react';
import axios from 'axios';
import makeToast from '../Toaster';
import { withRouter, Link } from 'react-router-dom';

const Login = (props) => {

    const refemail = React.createRef();
    const refpassword = React.createRef();

    const loginUser = () => {
        const email = refemail.current.value;
        const password = refpassword.current.value;

        axios.post('http://localhost:8800/api/user/login',{email,password})
        .then((res) => {
            //console.log(res.data.token);
            makeToast('success', 'Login Successful!');
            localStorage.removeItem('CHATCHAT_token');
            localStorage.setItem('CHATCHAT_token',res.data.token);
            props.history.push('/dashboard');
            //props.setupSocket();
        }).catch((err) => {
            makeToast('error', err);
        })
    }

    return (
        <div className="card">
            <div><h3 className="login-header">Login</h3> </div>
            <div className="cardBody">
                <div className="inputGroup">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" id="email" placeholder="john@mail.com" ref={refemail}></input>
                </div>
                <div className="inputGroup">
                    <label htmlFor="email">Password</label>
                    <input type="password" name="password" id="password" ref={refpassword}></input>
                </div>
                
                <div className="chatroom">
                    <div className="join" onClick={loginUser}>Login</div>
                    <Link to={'/register'} className="join">Register</Link>
                </div>
                
            </div>
        </div>
    )
}

export default withRouter(Login)
