import React from "react"
import { Container, Row, Col } from "react-bootstrap"
import { useNavigate } from "react-router-dom";
import ReactionList from "../reaction/ReactionList";

const MessageItem = ({ message }) => {
    const navigate = useNavigate();
    
    const clickReplyButton = () => {
        navigate(`/thread/${message.channel_id}/${message.id}`)
    }

    return (
        <div style = {{width: "100%"}}>
            <Container>
                <Row>
                    <Col className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0" style={{ fontWeight: "bold" }}> {message.user_name} </h5>
                        <p style={{ color: "grey" }}>{message.post_time}</p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p className="mb-0">{message.body}</p>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col xs={12} className="d-flex justify-content-between align-items-center">
                        <ReactionList messageId={message.id} reactions={message.reactions}/>
                        <div onClick = {clickReplyButton}>
                            <span style={{color: "#888",cursor: "pointer"}}>
                                {message.num_replies} Replies
                            </span>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>

    )
}

export default MessageItem;