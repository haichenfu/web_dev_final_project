import React from "react"
import { Container, Row, Col } from "react-bootstrap"
import ReactionList from "../reaction/ReactionList"

const ReplyItem = ({ reply }) => {
    console.log(reply.length)
    console.log(reply)
    return (
        <div style = {{width: "100%"}}>
            <Container>
                <Row>
                    <Col className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0" style={{ fontWeight: "bold" }}> {reply.user_name} </h5>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p className="mb-0">{reply.body}</p>
                    </Col>
                </Row>
                <Row className="mb-3">
                    {/* <Col xs={12} className="d-flex justify-content-between align-items-center">
                        <ReactionList messageId={reply.id} reactions={reply.reactions}/>
                    </Col> */}
                </Row>
            </Container>
        </div>

    )
}

export default ReplyItem;