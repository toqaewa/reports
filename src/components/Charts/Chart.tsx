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
    if (!quarter) return "#8884d8";

    const quarterColors: Record<string, string> = {
      "2024 Q1": "#91C4FA",
      "2024 Q2": "#91DEAB",
      "2024 Q3": "#FAABDE",
      "2024 Q4": "#FAC491",
      "2025 Q1": "#91DEDE",
      "2025 Q2": "#8884d8",
    };

    return quarterColors[quarter] || "#8884d8";
  };

  const groupedData = useMemo(() => {
    const grouped: Record<
      string,
      { type: string; quarters: Record<string, number> }
    > = {};

    data.forEach((item) => {
      if (!item.type || !item.quarter) return;

      if (!grouped[item.type]) {
        grouped[item.type] = {
          type: item.type,
          quarters: {},
        };
      }

      const value = (item[dataKey as keyof ChartDataItem] as number) || 0;
      grouped[item.type].quarters[item.quarter] = value;
    });

    return Object.values(grouped);
  }, [data, dataKey]);

  const quarters = useMemo(() => {
    const uniqueQuarters = new Set<string>();
    data.forEach((item) => {
      if (item.quarter) {
        uniqueQuarters.add(item.quarter);
      }
    });
    return Array.from(uniqueQuarters).sort();
  }, [data]);

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
                fill={getBarColor(quarter)}
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
