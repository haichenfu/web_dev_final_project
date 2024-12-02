import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap"
import ChannelList from "../components/channel/ChannelList"
import UserName from "../components/user/UserName"
import MessageList from "../components/message/MessageList";
import ReplyList from "../components/reply/ReplyList";

const ThreadPage = () => {
    const { channelId, messageId } = useParams();
    const [channelName, setChannelName] = useState("")

    const getChannelName = ()=> {
        fetch(`/api/channel/name/${channelId}`, {
            method: "GET",
            headers: { 'Content-Type': 'application/json', 'x-api-key': localStorage.getItem('haichenfu_api_key')}
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("fail to get the channel name");
            }
        })
        .then(data => {
            setChannelName(data.name);
        })
        .catch(err => {
            console.log(err.message);
        })
    }

    // init the thread page
    useEffect(() => {
        getChannelName();
    }, [channelId])

    return (
        <div>
            <Container fluid style={{ height: "100vh" }}> 
                <Row className="" style={{ height: "100vh", width: "100%" }}>
                    {/* Left Column: 1/3 Width */}
                    <Col
                        md={2}
                        className="d-none d-md-flex flex-column justify-content-between"
                        style={{
                            backgroundColor: "purple",
                            color: "white",
                            padding: "20px",
                            height: "100vh",
                        }}
                    >
                        <div>
                        <h1>Belay</h1>
                        <ChannelList />
                        </div>
                        <UserName />
                    </Col>

                    {/* Right Column: 2/3 Width on medium screens, full width on small screens */}
                    <Col
                        xs={0}
                        md={5}
                        className="d-none d-md-flex"
                        style={{
                            backgroundColor: "white",
                            padding: "20px",
                            height: "100vh",
                        }}
                    >
                        <MessageList channelId={channelId} channelName={channelName} />
                    </Col>
                    <Col
                        xs={12}
                        md={5}
                        className="d-flex"
                        style={{
                            backgroundColor: "white",
                            padding: "20px",
                            height: "100vh"
                        }}
                    >
                        <ReplyList channelId={channelId} messageId={messageId}/>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default ThreadPage;
