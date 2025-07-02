import { TaskData, ChartData } from "./types";

export const calculateStats = (
  data: TaskData[],
  field: string,
  metric: "count" | "estimate"
): ChartData[] => {
  if (!data || !data.length) return [];

  const result: Record<string, number> = {};

  data.forEach((task) => {
    const value = task[field]?.trim() || "Не указан";
    const numValue =
      metric === "count" ? 1 : parseFloat(task["Оценка (в часах)"] || "0");

    if (!result[value]) result[value] = 0;
    result[value] += numValue;
  });

  return Object.entries(result).map(([key, value]) => ({
    type: key,
    [metric]: metric === "estimate" ? Math.round(value) : value,
  }));
};

export const calculateLabelStats = (data: TaskData[]): ChartData[] => {
  if (!data || !data.length) return [];

  const labelCounts: Record<string, number> = {};
  let noLabelCount = 0;

  data.forEach((task) => {
    if (!task["Лейблы"] || task["Лейблы"].trim() === "") {
      noLabelCount++;
      return;
    }

    const labels = task["Лейблы"]
      .split(",")
      .map((label) => label.trim())
      .filter(Boolean);
    labels.forEach((label) => {
      labelCounts[label] = (labelCounts[label] || 0) + 1;
    });
  });

  const result = Object.entries(labelCounts)
    .map(([label, count]) => ({ type: label, count }))
    .sort((a, b) => b.count - a.count);

  if (noLabelCount > 0) {
    result.push({ type: "Без лейбла", count: noLabelCount });
  }

  return result;
};

export const calculateSprintStats = (data: TaskData[]): ChartData[] => {
  if (!data || !data.length) return [];

  const sprintDistribution: Record<number, number> = {};

  data.forEach((task) => {
    const count = parseInt(task["Кол-во спринтов"] || "0");
    sprintDistribution[count] = (sprintDistribution[count] || 0) + 1;
  });

  return Object.entries(sprintDistribution)
    .map(([sprintNum, count]) => ({
      type: `${sprintNum} спринтов`,
      count,
    }))
    .sort((a, b) => parseInt(a.type) - parseInt(b.type));
};