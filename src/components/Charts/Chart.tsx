import React from "react";
import "../../index.css";
import "./Chart.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import CustomTooltip from "./CustomTooltip";

interface ChartDataItem {
  type: string;
  count?: number;
  estimate?: number;
  quarter?: string;
}

interface ChartProps {
  data: ChartDataItem[];
  name: string;
  dataKey: string;
}

export const Chart: React.FC<ChartProps> = ({ data, name, dataKey }) => {
  const getBarColor = (quarter?: string): string => {
    if (!quarter) return '#8884d8';
    
    const quarterColors: Record<string, string> = {
      '2023 Q1': '#8884d8',
      '2023 Q2': '#82ca9d',
      '2023 Q3': '#ffc658',
      '2023 Q4': '#ff8042',
      '2024 Q1': '#0088FE',
      '2024 Q2': '#00C49F',
      '2024 Q3': '#FFBB28',
      '2024 Q4': '#FF8042',
    };
    
    return quarterColors[quarter] || '#8884d8';
  };

  return (
    <div className="chart-container">
      <h2>{name}</h2>
      {!data || data.length === 0 ? (
        <div className="no-data-message">Нет данных для отображения</div>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid
              horizontal={true}
              vertical={false}
              strokeDasharray="3 3"
              strokeOpacity="0.3"
            />
            <XAxis dataKey="type" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Bar
              dataKey={dataKey}
              radius={[4, 4, 0, 0]}
              activeBar={{ fillOpacity: 0.8 }}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getBarColor(entry.quarter)} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
