import React, { useEffect, useState } from "react"
import ReplyItem from "./ReplyItem";
import {Row, Col, Button} from "react-bootstrap";
import MessageItem from "../message/MessageItem";
import { useNavigate } from "react-router-dom";


const ReplyList = ({ channelId, messageId }) => {
    const [replies, setReplies] = useState([]);
    const [message, setMessage] = useState([]);
    const navigate = useNavigate();

    // function to fetch all replies of a message
    const fetchReplies = () => {
        fetch(`/api/message/reply/${messageId}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json', 'x-api-key': localStorage.getItem('haichenfu_api_key')}
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error("Reply loaded failed");
            }
        })
        .then(data => {
            setReplies(data['replies_list']);
        })
        .catch(err => {
            console.log(err.message)
        })
    }

    const fetchMessage = () => {
        fetch(`/api/message/id/${messageId}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json', 'x-api-key': localStorage.getItem('haichenfu_api_key')}
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error("message doesn't exist");
            }
        })
        .then(data => {
            setMessage(data);
        })
        .catch(err => {
            console.log(err.message)
        })
    }

    // function to post reply to a message
    const postReply = () => {
        var replyBody = document.getElementById('replyBody').value;
        fetch(`/api/message/reply/${messageId}`, {
            method: 'POST', 
            headers: {'Content-Type': 'application/json', 'x-api-key': localStorage.getItem('haichenfu_api_key')},
            body: JSON.stringify({"body": replyBody})
        })
        .then(response => {
            if (response.ok) {
                document.getElementById('replyBody').value = "";
                fetchReplies();
            } else {
                throw new Error("Fail to post a new reply");
            }
        })
        .catch(err => {
            console.log(err.message)
        })
        
    }

    // init the reply list
    useEffect(() => {
            fetchReplies();
            fetchMessage();
    }, [messageId])

    // function to navigate back to channel
    const backToChannel = () => {
        navigate(`/channel/${channelId}`)
    }

    return (
        <div className="flex-column align-items-center" style={{height:"100%", width: "100%"}}>
            <Row className="flex align-items-center" >
                <Col>
                    <h3 style={{color: "grey"}}>Replies</h3>
                </Col>
                <Col className="text-end">
                    <Button style={{backgroundColor: "white", color:"grey", border:"none", fontSize: "1.5rem"}} onClick={backToChannel}>
                        <i className="bi bi-x-circle"></i>
                    </Button>
                </Col>
                <hr style={{ width: "100%", border: "1px solid #ddd" }} />
            </Row>
            
            <Row style={{backgroundColor: "#dddddd"}} className="mb-2">
                <ReplyItem reply={message}/>
            </Row>

            <Row
            style={{
                flex: 1, 
                overflowY: "auto", 
                maxHeight: "75%"
            }}
            >
            {replies.length > 0 && replies.map((reply, index) => (
                <ReplyItem key={index} reply={reply} />
            ))}
            </Row>
        
            {/* Fixed Input Area */}
            <div
            style={{
                borderTop: "1px solid #ddd",
                padding: "10px",
                backgroundColor: "white",
                height: "20%"
            }}
            >
            <textarea
                id="replyBody"
                className="form-control mb-2"
                style={{
                width: "100%",
                height: "65%"
                }}
                placeholder="Type your reply here..."
            ></textarea>
            <Row className="d-flex justify-content-end">
                <Col xs="auto">
                <button
                    className="btn"
                    style={{ backgroundColor: "purple", color: "white" }}
                    onClick={postReply}
                >
                    Reply
                </button>
                </Col>
            </Row>
            </div>
        </div>
    );
}

export default ReplyList;