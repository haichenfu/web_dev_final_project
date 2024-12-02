import React, { useEffect, useState } from "react"
import {Row, Col, Button} from "react-bootstrap";
import ReactionItem from "./ReactionItem";
import ReactionAddItem from "./ReactionAddItem";

const ReactionList = ({ reactions, messageId }) => {
    const [display, setDisplay] = useState(false);
    const showReactionBar = () => {
        setDisplay(true);
    }
    const closeReactionBar = () => {
        setDisplay(false);
    }

    const emojis = ["🤣", "🥹", "🥲", "😭", "👍"]

    
    return(
        <div>
            <div className="align-items-center">
                {reactions.map((reaction, index) => (
                    <ReactionItem
                        key={index}
                        messageId = {messageId}
                        emoji = {reaction['emoji']}
                        count = {reaction['count']}
                    />
                ))}
                <Button onClick = {showReactionBar} style={{backgroundColor: "white", color:"grey", border:"none", fontSize: "1.5rem", display: display ? 'none': 'inline'}}>
                    <i className="bi bi-plus"></i>
                </Button>
                <Button onClick = {closeReactionBar} style={{backgroundColor: "white", color:"grey", border:"none", fontSize: "1.5rem", display: display ? 'inline' : 'none'}}>
                    <i className="bi bi-x"></i>
                </Button>
            </div>
   
            <div style={{display: display ? 'inline' : 'none'}}>   
                <ul style={{ listStyleType: "none", margin: 2, padding: 0, display: "flex", gap: "10px"}}>
                    {
                        emojis.map((emoji, index) => (
                            <ReactionAddItem 
                                key = {index}
                                emoji = {emoji}
                                messageId= {messageId}
                            />
                        ))
                    }
                    {/* <li><p>🤣</p></li>
                    <li><p>🥹</p></li>
                    <li><p>🥲</p></li>
                    <li><p>😭</p></li>
                    <li><p>👍</p></li> */}
                </ul>
            </div>


        </div>
        
        
    )

}

export default ReactionList;