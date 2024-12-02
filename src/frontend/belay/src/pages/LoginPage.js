import { Container, Form, Button } from "react-bootstrap";
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const LoginPage = () => {
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const loginPost = () => {
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        var loginInfo = { username: username, password: password };

        fetch('/api/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginInfo)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Invalid login credentials"); 
            }
        })
        .then(data => {
            console.log("user login successfully")
            // store the user api key in local session
            localStorage.setItem("haichenfu_api_key", data.api_key);
            localStorage.setItem("haichenfu_username", data.username);
            // redirect the user to homepage
            const from = location.state?.from?.pathname || "/home";
            navigate(from);
        })
        .catch(err => {
            // set the error state to login error
            setError(err.message);
        })
    }

    const signupPost = () => {
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        var signupInfo = { username: username, password: password };

        fetch('/api/user/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(signupInfo)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Username already exist");
            }
        })
        .then(data => {
            console.log("user signup and login successfully")
            // store user apikey in local session
            localStorage.setItem("haichenfu_api_key", data.api_key);
            localStorage.setItem("haichenfu_username", data.username);
            // redirect the user to homepage
            navigate("/home");
        })
        .catch(err => {
            setError(err.message);
        })
    }

    return (
        <div>
            <Container className="p-3 my-5 flex w-25 fluid">
                <p className='text-center fs-3' style={{ color: 'purple' }}>Belay</p>
                <Form>
                    <div className="form-outline mb-4">
                        <label className="form-label">Username</label>
                        <input id="username" className="form-control"/>
                    </div>
                    <div className="form-outline mb-4">
                        <label className="form-label">Password</label>
                        <input type="password" id="password" className="form-control" />
                    </div>
                </Form>

                <p id='wrongPwd' style={{ color: 'red', display: error !== "" ? 'block' : 'none' }}>{error}</p>
                <div className='text-center'>
                    <Button type="button" style={{ backgroundColor: "grey", borderColor: "grey", marginRight: "30px" }}className="btn btn-primary" onClick={signupPost}>Sign up</Button>
                    <Button type="button" style={{ backgroundColor: "purple", borderColor: "purple" }}className="btn btn-primary" onClick={loginPost}>Sign in</Button>
                </div>
            </Container>
        </div>
    )
}

export default LoginPage;