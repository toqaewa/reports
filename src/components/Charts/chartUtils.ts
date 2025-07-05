export interface ChartDataItem {
  type: string;
  count?: number;
  estimate?: number;
  quarter?: string;
}

export const transformToGroupedData = (
  data: ChartDataItem[],
  dataKey: string
) => {
  const grouped: Record<
    string,
    { type: string; quarters: Record<string, number> }
  > = {};
  const quartersSet = new Set<string>();

  data.forEach((item) => {
    if (!item.type || !item.quarter) return;

    quartersSet.add(item.quarter);

    if (!grouped[item.type]) {
      grouped[item.type] = {
        type: item.type,
        quarters: {},
      };
    }

    const value = (item[dataKey as keyof ChartDataItem] as number) || 0;
    grouped[item.type].quarters[item.quarter] = value;
  });

  const quarters = Array.from(quartersSet).sort();

  return {
    groupedData: Object.values(grouped),
    quarters,
  };
};

export const getQuarterColor = (quarter: string): string => {
  const quarterColors: Record<string, string> = {
    "2024 Q1": "#91C4FA",
    "2024 Q2": "#91DEAB",
    "2024 Q3": "#FAABDE",
    "2024 Q4": "#FAC491",
    "2025 Q1": "#91DEDE",
    "2025 Q2": "#8884d8",
    "2025 Q3": "#D291FA",
    "2025 Q4": "#FAD291",
  };

  return quarterColors[quarter] || "#8884d8";
};
