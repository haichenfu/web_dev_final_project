import React, { useEffect, useState } from "react"
import MessageItem from "./MessageItem";
import {Row, Col, Button} from "react-bootstrap";
import { useNavigate } from "react-router-dom";



const MessageList = ({ channelId, channelName}) => {
    const [messages, setMessages] = useState([]);
    const navigate = useNavigate();

    // function to fetch all messages of the channel
    const fetchMessages = () => {
        fetch(`/api/message/${channelId}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json', 'x-api-key': localStorage.getItem('haichenfu_api_key')}
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } 
            else {
                throw new Error("Message loaded failed");
            }
        })
        .then(data => {
            setMessages(data.messages);
        })
        .catch(err => {
            console.log(err.message)
        })
    }

    const postMessages = () => {
        var messageBody = document.getElementById('messageBody').value;
        fetch(`/api/message/${channelId}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'x-api-key': localStorage.getItem('haichenfu_api_key')},
            body: JSON.stringify({"body": messageBody})
        })
        .then(response => {
            if (response.ok) {
                fetchMessages();
                document.getElementById('messageBody').value = "";
            } else {
                throw new Error("Fail to post message");
            }
        })
        .catch(err => {
            console.log(err.message);
        })
    }

    useEffect(() => {
        fetchMessages();
        const intervalId = setInterval(fetchMessages, 500); 

        return () => clearInterval(intervalId);
    }, [channelId]);

    const backToHome = () => {
        navigate('/home');
    }

    return (

        <div className="flex-column align-items-center" style={{height:"100%", width:"100%"}}>
            <Row>
                <Col>
                    <h3>{channelName}</h3>
                </Col>
                <Col className="text-end">
                    <Button style={{backgroundColor: "white", color:"grey", border:"none", fontSize: "1.5rem"}} onClick={backToHome}>
                        <i className="bi bi-house"></i>
                    </Button>
                </Col>
                
                <hr style={{ width: "100%", border: "1px solid #ddd" }} />
            </Row>

            <Row
            style={{
                flex: 1, 
                overflowY: "auto", 
                maxHeight: "75%"
            }}
            >
            {messages.map((message, index) => (
                <MessageItem key={index} message={message} />
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
                id="messageBody"
                className="form-control mb-2"
                style={{
                width: "100%",
                height: "65%"
                }}
                placeholder="Type your message here..."
            ></textarea>
            <Row className="d-flex justify-content-end">
                <Col xs="auto">
                <button
                    className="btn"
                    style={{ backgroundColor: "green", color: "white" }}
                    onClick={postMessages}
                >
                    Post
                </button>
                </Col>
            </Row>
            </div>
        </div>
    );
}

export default MessageList;