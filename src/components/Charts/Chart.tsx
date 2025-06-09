import React from 'react';
import "../../index.css";
import "./Chart.css"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import CustomTooltip from './CustomTooltip';

interface ChartProps {
  data: { type: string; count?: number; estimate?: number }[];
  name: string;
  dataKey: string;
}

export const Chart: React.FC<ChartProps> = ({ data, name, dataKey }) => (
  <div className="chart-container">
    <h2>{name}</h2>
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid horizontal={true} vertical={false} strokeDasharray="3 3" strokeOpacity="0.3" />
        <XAxis dataKey="type" />
        <YAxis />
        <Tooltip 
          content={<CustomTooltip />}
          cursor={false}
        />
        <Bar 
          dataKey={dataKey} 
          radius={[4, 4, 0, 0]}
          activeBar={{ fillOpacity: 0.8 }}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
);