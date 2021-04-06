import React from "react";

import "./EventItem.css";

const EventItem = (props) => (
    <li key={props.eventId} className="event__list-item">
        <div>
            <h2>{props.title}</h2>
            <h3>${props.price} - {new Date(props.date).toLocaleDateString()}</h3>
        </div>
        { props.userId === props.creatorId 
            ? <p>You're an owner of this event</p> 
            : <button className="btn" onClick={props.onDetail.bind(this, props.eventId)}>View Details</button>
        }
    </li>
);


export default EventItem;
