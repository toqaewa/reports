import React from 'react';
import "./Chart.css"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CustomTooltip from './CustomTooltip';

interface EstimateChartProps {
  data: { type: string; count?: number; estimate?: number }[];
}

export const EstimateChart: React.FC<EstimateChartProps> = ({ data }) => (
  <div className="chart-container">
    <h2>Распределение эстимейта по задачам</h2>
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" strokeOpacity="0.5" />
        <XAxis dataKey="type" />
        <YAxis />
        <Tooltip 
          content={<CustomTooltip />}
          cursor={{
            fill: "#CF7B5A",
            fillOpacity: 0.1,
          }} 
        />
        <Bar 
          dataKey="estimate" 
          fill="#CF7B5A" 
          name="Estimate"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
);