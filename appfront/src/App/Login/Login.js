import React, { useState } from 'react';
import './Login.css';

function Login({ gotoadmin, gotouser }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const Attemptsignin = async () => {
        const response = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        setUsername('');
        setPassword('');
        const data = await response.json();
        if (data.success === true) {
            document.querySelector('.Login-error').innerHTML = null;
            if (data.admin === true) {
                gotoadmin(data.username, data.password);
            } else {
                gotouser(data.username, data.password);
            }
        } else {
            document.querySelector('.Login-error').innerHTML = data.error;
        }
    };

    return (
        <div className='Login' id='Login'>
            <div className='Login-Container'>
                <p className='Login-Container-Header'>Login</p>
                <div className='Login-Container-Username'>
                    <p className='Login-Container-Username-Label'>Username</p>
                    <input
                        className='Login-Container-Username-Input'
                        type='text'
                        value={username}
                        onChange={handleUsernameChange}
                    />
                </div>
                <div className='Login-Container-Password'>
                    <p className='Login-Container-Password-Label'>Password</p>
                    <input
                        className='Login-Container-Password-Input'
                        type='password'
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </div>
                <button type='submit' className='Login-Container-Signin' onClick={Attemptsignin}>
                    Sign In
                </button>
            </div>
            <p className='Login-error'></p> {/* this will be used to display errors */}
        </div>
    );
}

export default Login;
