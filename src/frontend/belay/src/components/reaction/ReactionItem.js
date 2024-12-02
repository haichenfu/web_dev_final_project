import React, { useEffect, useState } from "react"

const ReactionItem = ({ emoji, count, messageId }) => {
    const [users, setUsers] = useState([]);
    const [display, setDisplay] = useState(false);

    const getReactionUsers = () => {
        fetch(`/api/reaction/user/${messageId}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'x-api-key': localStorage.getItem('haichenfu_api_key')},
            body: JSON.stringify({"emoji": emoji})
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
        })
        .then(data => {
            setUsers(data["user_name_list"]);
            setDisplay(true);
        })
    }

    const handleMouseLeave = () => {
        setDisplay(false);
    }

    if (!emoji) return null;
    return (
        <div style={{display: "inline"}}>
            <div style={{postion: "relative", border: "solid #ddd", borderRadius: "5px", padding: "0px 5px", margin: "0px 1px", display: "inline"}} onMouseEnter={getReactionUsers} onMouseLeave={handleMouseLeave} >
                <span style={{color: "#888",cursor: "pointer"}}>
                    {emoji} {count} 
                </span>
            </div>
            
            <div style={{display: display ? 'inline' : 'none'}}>   
                <ul style={{ listStyleType: "none", margin: 0, padding: 0 }}>
                    {users.map((user, index) => (
                        <li key={index} style={{ padding: "5px 0", color: "#555" }}>
                            {user}
                        </li>
                    ))}
                </ul>
            </div>
        

        
        </div>
        
    )
}

export default ReactionItem;