import React from 'react';
import axios from 'axios';
import makeToast from '../Toaster';

const Register = (props) => {

    const refusername = React.createRef();
    const refemail = React.createRef();
    const refpassword = React.createRef();

    const registerUser = () => {
        const username = refusername.current.value;
        const email = refemail.current.value;
        const password = refpassword.current.value;

        axios.post('http://localhost:8800/api/user/register',{username,email,password})
        .then((res) => {
            console.log(res);
            makeToast('success', 'Account Created!');
            props.history.push('/login');
        }).catch((err) => {
            makeToast('error', err);
        })

    }

    return (
        <div className="card">
            <div><h3 className="login-header">Register User</h3> </div>
            <div className="cardBody">
            <div className="inputGroup">
                    <label htmlFor="email">Name</label>
                    <input type="text" name="username" id="username" placeholder="john" ref={refusername}></input>
                </div>
                <div className="inputGroup">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" id="email" placeholder="john@mail.com" ref={refemail}></input>
                </div>
                <div className="inputGroup">
                    <label htmlFor="email">Password</label>
                    <input type="password" name="password" id="password" ref={refpassword}></input>
                </div>
                <button onClick={registerUser}>Register</button>
            </div>
        </div>
    )
}

export default Register
