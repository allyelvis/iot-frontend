import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

const Dashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/data')
      .then(response => setData(response.data))
      .catch(error => console.error(error));
  }, []);

  const chartData = {
    labels: data.map(d => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Temperature',
        data: data.map(d => d.temperature),
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
      {
        label: 'Humidity',
        data: data.map(d => d.humidity),
        borderColor: 'rgba(153,102,255,1)',
        fill: false,
      }
    ],
  };

  return (
    <div>
      <h1>IoT Surveillance Dashboard</h1>
      <Line data={chartData} />
    </div>
  );
};

export default Dashboard;