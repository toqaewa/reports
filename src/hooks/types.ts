export type TaskData = Record<string, string> & {
  mergedLabels?: string;
  sprintCount?: string;
};

export type ChartData = {
  type: string;
  count?: number;
  estimate?: number;
};

export type StatsData = {
  team: string;
  count: number;
  estimate: number;
};

export type QuarterStats = {
  quarter: string;
  taskTypeStats: ChartData[];
  taskPriorityStats: ChartData[];
  estimateStats: ChartData[];
  taskAssigneeStats: ChartData[];
  taskReporterStats: ChartData[];
  labelStats: ChartData[];
  sprintStats: ChartData[];
};

export type GroupedChartData = {
  type: string;
  count?: number;
  estimate?: number;
  quarter: string;
};

export type StatsCalculations = {
  taskTypeStats: ChartData[];
  taskPriorityStats: ChartData[];
  estimateStats: ChartData[];
  taskAssigneeStats: ChartData[];
  taskReporterStats: ChartData[];
  labelStats: ChartData[];
  sprintStats: ChartData[];
};

export type GroupedStats = {
  taskTypeStats: GroupedChartData[];
  taskPriorityStats: GroupedChartData[];
  estimateStats: GroupedChartData[];
  taskAssigneeStats: GroupedChartData[];
  taskReporterStats: GroupedChartData[];
  labelStats: GroupedChartData[];
  sprintStats: GroupedChartData[];
};