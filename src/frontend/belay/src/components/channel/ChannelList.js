import React, { useState, useEffect } from "react";
import ChannelItem from "./ChannelItem";
import { Row, Col, Container } from "react-bootstrap"

const ChannelList = ({ selectedId }) => {
    const [display, setDisplay] = useState(false);
    const [channels, setChannels] = useState([]);

    // function to fetch the list of channels 
    const fetchChannels = () => {
        fetch('/api/channel/all', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'x-api-key': localStorage.getItem('haichenfu_api_key')},
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error("Channel loaded failed");
            }
        })
        .then(data => {
            setChannels(data.channels);
        })
        .catch(err => {
            console.log(err.message);
        })
    }

    // useEffect to fetch channels periodically
    useEffect(() => {
        fetchChannels();
        const intervalId = setInterval(fetchChannels, 1000); // Fetch every second

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, [selectedId]);

    // show the create channel div
    const createButtonClick = () => {
        setDisplay(true);
    }
    
    // archive the create channel div
    const cancelButtonClick = () => {
        setDisplay(false);
    }

    // function to create new channel
    const createNewChannel = () => {
        var channelName = document.getElementById('channelName').value;
        fetch('/api/channel/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': localStorage.getItem('haichenfu_api_key') },
            body: JSON.stringify({"name": channelName})
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Channel name already exist");
            }
        })
        .then(data => {
            // hide the text input area
            setDisplay(false);
            // reload the channel list
            fetchChannels();
        })
        .catch(err => {
            alert(err.message);
        })
    }


  return (
    <div className="channel-list">
        <div className="d-flex justify-content-between align-items-center">
            <h5 className="px-3 pt-3">Channels</h5>
            <button className="btn btn-lg fw-bold pt-3" style={{color: 'white', backgroundColor: 'purple'}} onClick={createButtonClick}>
                <i className="bi bi-plus"></i>
            </button>
        </div>
        <div className="d-flex justify-content-end gap-2 mb-3" >
            <Container style={{display: display ? 'block' : 'none' }}>
                <Row>
                    <textarea id="channelName" className="form-control mb-2"></textarea>
                </Row>
                <Row className="d-flex">
                    <Col>
                        <button className="btn btn-secondary" onClick={cancelButtonClick} > Cancel </button>
                    </Col>
                    <Col>
                        <button className="btn btn-success" onClick={createNewChannel}>Create</button>
                    </Col>
                </Row>
            </Container>
        </div>
        <div>
            {channels.map((channel, index) => (
            <ChannelItem
                key={index}
                channelId={channel.id}
                channelName={channel.name}
                unreadCount={channel.unread_count}
                selectedId = {selectedId}
            />
            ))}
        </div>
    </div>
  );
};

export default ChannelList;