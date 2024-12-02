import React, { useEffect, useState } from "react"


const ReactionAddItem = ({emoji, messageId}) => {
    const AddReactionToMessage = () => {
        fetch(`/api/reaction/${messageId}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'x-api-key': localStorage.getItem('haichenfu_api_key')},
            body: JSON.stringify({"emoji": emoji})
        })
    }
    return (
        <div>
            <li onClick={AddReactionToMessage}><p>{emoji}</p></li>
        </div>
    )

}

export default ReactionAddItem;