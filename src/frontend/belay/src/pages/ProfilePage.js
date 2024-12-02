import { Container, Form, Button } from "react-bootstrap";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
    const [error, setError] = useState("");
    const [info, setInfo] = useState("");
    const navigate = useNavigate();

    const updateUsername = () => {
        var username = document.getElementById('username').value;
        setError("");
        setInfo("");
        fetch('/api/user/name', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': localStorage.getItem('haichenfu_api_key')},
            body: JSON.stringify({"username": username})
        })
        .then(response => {
            if (response.ok) {
                // update the username in localstorage
                localStorage.setItem("haichenfu_username", username);
                setInfo("update username successfully");
            } else {
                throw new Error("username already exist");
            }
        })
        .catch((err) => {
            setError(err.message);
        })
    }

    const updatePassword = () => {
        var password = document.getElementById('password').value;
        setError("");
        setInfo("");
        fetch('/api/user/password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': localStorage.getItem('haichenfu_api_key')},
            body: JSON.stringify({"password": password})
        })
        .then(response => {
            if (response.ok) {
                setInfo("update password successfully");
            } else {
                throw new Error("fail to update password, please try again")
            }
        })
        .catch((err) => {
            setError(err.message);
        })
    }


    return (
        <div>
            <Container className="p-3 my-5 flex w-30 fluid">
            <div style={{ position: 'relative' }}>
                <i
                className="bi bi-arrow-left-circle"
                style={{
                    fontSize: '2rem',
                    color: 'purple',
                    cursor: 'pointer',
                    position: 'absolute',
                    top: '-40px', 
                    left: '-10px',
                }}
                onClick={() => navigate('/home')}
                ></i>
            </div>
                <p className='text-center fs-3' style={{ color: 'purple' }}>User Setting</p>
                <Form>
                    <div className="form-outline mb-4">
                        <label className="form-label">Username</label>
                        <input id="username" className="form-control" defaultValue={localStorage.getItem('haichenfu_username')}/>
                    </div>
                    <div className="form-outline mb-4">
                        <label className="form-label">Password</label>
                        <input type="password" id="password" className="form-control" />
                    </div>
                </Form>

                <p id='wrongPwd' style={{ color: 'red', display: error !== "" ? 'block' : 'none' }}>{error}</p>
                <p id='infoMsg' style={{ color: 'green', display: info !== "" ? 'block' : 'none' }}>{info}</p>
                <div className='text-center'>
                    <Button type="button" style={{ backgroundColor: "purple", borderColor: "purple", marginRight: "30px" }} className="btn btn-primary" onClick={updateUsername} >Update username</Button>
                    <Button type="button" style={{ backgroundColor: "grey", borderColor: "grey" }}className="btn btn-primary" onClick={updatePassword} >Update Password</Button>
                </div>
            </Container>
        </div>
    )
}

export default ProfilePage;