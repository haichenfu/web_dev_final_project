import React from "react";
import { useNavigate } from "react-router-dom";

const ChannelItem = ({ channelId, channelName, unreadCount, selectedId }) => {
    const navigate = useNavigate();

    const viewChannel = () => {
      navigate(`/channel/${channelId}`)
    }
    
    return (
      <div id={`channel${channelId}`} 
        className="channel-item d-flex justify-content-between align-items-center py-1 px-3" 
        style={{
          backgroundColor: Number(channelId) === Number(selectedId) ? "#cccccc" : "transparent", 
          color: Number(channelId) === Number(selectedId) ? "black" : "white"
        }}
        onClick={viewChannel} 
      >
        <span>{channelName}</span>
        {unreadCount > 0 && (
          <span className="badge bg-primary">{unreadCount}</span>
        )}
      </div>
    );
  };
  
  
export default ChannelItem;