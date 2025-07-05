import React, { useMemo } from "react";
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
} from "recharts";
import CustomTooltip from "./CustomTooltip";
import { ChartDataItem, transformToGroupedData, getQuarterColor } from "./chartUtils";

interface ChartProps {
  data: ChartDataItem[];
  name: string;
  dataKey: string;
}

// TODO: вынести отсюда все про квартал, сейчас график умеет только в 1 тип отчета

export const Chart: React.FC<ChartProps> = ({ data, name, dataKey }) => {

  const { groupedData, quarters } = transformToGroupedData(data, dataKey);

  return (
    <div className="chart-container">
      <h2>{name}</h2>
      {!data || data.length === 0 ? (
        <div className="no-data-message">Нет данных для отображения</div>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={groupedData}>
            <CartesianGrid
              horizontal={true}
              vertical={false}
              strokeDasharray="3 3"
              strokeOpacity="0.3"
            />
            <XAxis dataKey="type" 
              type="category" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            {quarters.map(quarter => (
              <Bar
                key={quarter}
                dataKey={`quarters.${quarter}`}
                name={quarter}
                fill={getQuarterColor(quarter)}
                radius={[4, 4, 0, 0]}
                activeBar={{ fillOpacity: 0.8 }}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
