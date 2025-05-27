import React from 'react';
import "./Chart.css"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CustomTooltip from './CustomTooltip';

interface TaskAssigneeChartProps {
  data: { type: string; count?: number; estimate?: number }[];
}

export const TaskAssigneeChart: React.FC<TaskAssigneeChartProps> = ({ data }) => (
  <div className="chart-container">
    <h2>Распределение задач по исполнителю</h2>
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" strokeOpacity="0.5" />
        <XAxis dataKey="type" />
        <YAxis />
        <Tooltip 
          content={<CustomTooltip />}
          cursor={false}
        />
        <Bar 
          dataKey="count" 
          name="Количество задач"
          radius={[4, 4, 0, 0]}
          activeBar={{ fillOpacity: 0.8 }}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
);