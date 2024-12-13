import React from "react";
import { Container, Row, Button, Col } from "react-bootstrap"
import { useNavigate } from "react-router-dom";

const UserName = () => {
    const navigate = useNavigate();
    const logoutButton = () => {
        // remove stored api_key and username in localstorage
        localStorage.removeItem("haichenfu_api_key");
        localStorage.removeItem("haichenfu_username");
        navigate("/login")
    }
    const profileButton = () => {
        navigate("/profile");
    }
    return (
        <div>
            <Container fluid>
                <Row className="d-flex align-items-center justify-content-between" style={{padding: "20px"}}>
                    <Col>
                        <h4 onClick={profileButton}>{localStorage.getItem("haichenfu_username")}</h4>
                    </Col>
                    <Col>
                        <Button style={{backgroundColor: "transparent", border:"none", fontSize: "1.5rem"}} onClick={logoutButton}>
                            <i className="bi bi-box-arrow-right"></i>
                        </Button>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default UserName;