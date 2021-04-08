import React from "react";
import { Bar as BarChart } from 'react-chartjs';

import "./BookingsChart.css";

const BOOKINGS_BUCKETS = {
    Cheap: {
        min: 0,
        max: 100,
    },
    Normal: {
        min: 100,
        max: 200,
    },
    Expensive: {
        min: 200,
        max: 10000,
    },
};

const BookingsChart = (props) => {
    const chartData = {labels: [], datasets: []};
    for (const bucket in BOOKINGS_BUCKETS) {
        const filteredBookingsCount = props.bookings.reduce((prev, current) => {
            if (
                current.event.price > BOOKINGS_BUCKETS[bucket].min &&
                current.event.price <= BOOKINGS_BUCKETS[bucket].max
            ) {
                return prev + 1;
            } else {
                return prev;
            }
        }, 0);
        chartData.labels.push(bucket);
        chartData.datasets.push({
            fillColor: 'rgba(220,220,220,0.5)',
            fillStroke: 'rgba(220,220,220,0.8)',
            highlightFill: 'rgba(220,220,220,0.75)',
            highlightStroke: 'rgba(220,220,220,1)',
            data: [filteredBookingsCount]
        });
    };

    return <BarChart data={chartData} />;
};

export default BookingsChart;