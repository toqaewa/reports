import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TaskAssigneeChartProps {
  data: { type: string; count?: number; estimate?: number }[];
}

export const TaskAssigneeChart: React.FC<TaskAssigneeChartProps> = ({ data }) => (
  <div className="chart-container" style={{ marginBottom: '40px' }}>
    <h2 style={{ color: '#444', marginBottom: '20px' }}>
      Распределение задач по исполнителю
    </h2>
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="type" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar 
          dataKey="count" 
          fill="#8884d8" 
          name="Количество задач"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
);