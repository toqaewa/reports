import "./Chart.css";

import { TooltipProps } from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <div style={{ width: "100%" }}>{label}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {payload.map((entry: any, index: number) => (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "8px",
                  width: 140,
                }}
              >
                <h4 style={{ width: "100%", color: entry.color }}>
                  {entry.name}
                </h4>
                <h4>{entry.value}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
