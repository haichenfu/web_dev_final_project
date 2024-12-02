import React from "react";
import { Container, Row, Col } from "react-bootstrap"
import ChannelList from "../components/channel/ChannelList"
import UserName from "../components/user/UserName"

const HomePage = () => {
    return (
        <div>
            <Container fluid style={{ height: "100vh" }}> 
                <Row style={{ height: "100%" }}>
                {/* Left Column: 1/3 Width */}
                <Col xs={12} md={3} className="d-flex flex-column justify-content-between" 
                    style={{ backgroundColor: "purple", color: "white", padding: "20px", height: "100vh"}} >
                    <div>
                        <h1>Belay</h1>
                        <ChannelList/>
                    </div>
                    <UserName />
                </Col>

                {/* Right Column: 2/3 Width */}
                <Col xs={12} md={9} 
                    className="d-flex justify-content-center align-items-center"
                    style={{ backgroundColor: "white", color: "grey", padding: "20px", }} 
                >
                    <h1>Welcome to Belay</h1>
                </Col>
                </Row>
            </Container>
        </div>
    )
}

export default HomePage;
