import React from 'react';
import { Pie } from 'react-chartjs-2';
import { HourEntry } from '../types/volunteerTypes';

interface LocationPieChartProps {
  hours: HourEntry[];
}

const locationOrder = ['Cattery', 'Petsmart', 'Tractor Supply', 'Foster'];
const locationColorMap: Record<string, string> = {
  'Cattery': '#4e79a7',
  'Petsmart': '#f28e2b',
  'Tractor Supply': '#e15759',
  'Foster': '#76b7b2'
};

const LocationPieChart: React.FC<LocationPieChartProps> = ({ hours }) => {
  // Build hours map
  const locationHoursMap: Record<string, number> = {};
  hours.forEach(entry => {
    const locationName = entry.location || 'Unknown';
    const h = typeof entry.hours === 'number' ? entry.hours : parseFloat(entry.hours);
    locationHoursMap[locationName] = (locationHoursMap[locationName] || 0) + h;
  });

  const labels = locationOrder;
  const data = locationOrder.map(loc => locationHoursMap[loc] || 0);
  const colors = locationOrder.map(loc => locationColorMap[loc] || '#bab0ab');

  const pieData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors,
        borderWidth: 1,
      },
    ],
  };

  return <Pie data={pieData} />;
};

export default LocationPieChart;