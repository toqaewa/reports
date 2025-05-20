import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface EstimateChartProps {
  data: { type: string; count?: number; estimate?: number }[];
}

export const EstimateChart: React.FC<EstimateChartProps> = ({ data }) => (
  <div className="chart-container">
    <h2 style={{ color: '#444', marginBottom: '20px' }}>
      Распределение эстимейта по задачам
    </h2>
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="type" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar 
          dataKey="estimate" 
          fill="#82ca9d" 
          name="Estimate"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
);