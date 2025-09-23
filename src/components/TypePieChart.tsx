import React from 'react';
import { Pie } from 'react-chartjs-2';
import { HourEntry } from '../types/volunteerTypes';

interface TypePieChartProps {
  hours: HourEntry[];
}

const typeOrder = ['Cleaning', 'Adoption Event', 'Fostering'];
const typeColorMap: Record<string, string> = {
  'Cleaning': '#edc949',
  'Adoption Event': '#af7aa1',
  'Fostering': '#4e79a7'
};

const TypePieChart: React.FC<TypePieChartProps> = ({ hours }) => {
  // Build hours map
  const typeHoursMap: Record<string, number> = {};
  hours.forEach(entry => {
    const typeName = entry.type || 'Unknown';
    const h = typeof entry.hours === 'number' ? entry.hours : parseFloat(entry.hours);
    typeHoursMap[typeName] = (typeHoursMap[typeName] || 0) + h;
  });

  const labels = typeOrder;
  const data = typeOrder.map(type => typeHoursMap[type] || 0);
  const colors = typeOrder.map(type => typeColorMap[type] || '#bab0ab');

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

export default TypePieChart;