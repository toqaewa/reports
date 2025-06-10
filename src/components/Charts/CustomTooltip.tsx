import "./Chart.css"

import { TooltipProps } from 'recharts';
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>)  => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <div style={{display: "flex", flexDirection: "column", gap: 8}}>
            {payload.map((pld) => (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", flexDirection: "row", gap: "8px", width: 140 }}>
                    <div style={{ width: "100%" }}>{label}</div>
                    <h4>{pld.value}</h4>
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

