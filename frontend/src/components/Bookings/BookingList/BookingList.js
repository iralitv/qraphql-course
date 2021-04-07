import React from "react";

import './BookingList.css'

const BookingList = (props) => (
    <ul className="bookings__list">
        { props.bookings.map(booking => 
            <li key={booking._id} className="bookings__item">
                <div className="bookings__item-data">
                    {booking.event.title} - {new Date(booking.event.date).toLocaleDateString()}
                </div>
                <button className="btn" onClick={props.onDelete.bind(this, booking._id)}>Cancel</button>
            </li>
        )}
    </ul>
);

export default BookingList;