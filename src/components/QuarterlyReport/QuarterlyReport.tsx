import React, { useMemo, useState } from "react";
import "./QuarterlyReport.css";
import { useTaskData } from "../../hooks/useTaskData";
import { useTaskStats } from "../../hooks/useTaskStats";
import { useTeamStats } from "../../hooks/useTeamStats";
import { useQuarterStats } from "../../hooks/useQuarterStats";
import { useSearch } from "../../hooks/useSearch";
import { CSVUploader } from "../CSVUploader/CSVUploader";
import { DataTable } from "../DataTable/DataTable";
import { Input } from "../Input/Input";
import { Chart } from "../Charts/Chart";
import { Stats } from "../Stats/Stats";

export const QuarterlyReport: React.FC = () => {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  const { data, handleOnDrop, clearData } = useTaskData();

  const {
    filteredData,
    taskTypeStats,
    taskPriorityStats,
    estimateStats,
    taskAssigneeStats,
    taskReporterStats,
    sprintStats,
    labelStats,
  } = useTaskStats(data, selectedTeam);

  const { teamStats } = useTeamStats(data);

  const { quarterStats, groupedStats } = useQuarterStats(filteredData);

  const { globalFilter, handleSearchChange, handleClearSearch } = useSearch();

  const sortedTeamStats = useMemo(() => {
    return [...teamStats].sort((a, b) => {
      if (a.team === "Без команды") return 1;
      if (b.team === "Без команды") return -1;

      if (a.count === 0 && b.count > 0) return 1;
      if (b.count === 0 && a.count > 0) return -1;

      return b.count - a.count;
    });
  }, [teamStats]);

  const hasMultipleQuarters = useMemo(() => {
    const validQuarters = quarterStats.filter((q) => q.quarter !== "Не указан");
    return validQuarters.length > 1;
  }, [quarterStats]);

  // const handleTeamSelect = (team: string) => {
  //   setSelectedTeam(prev => prev === team ? null : team);
  // };

  return (
    <div>
      <div className="title-section">
        <h1>Отчет о квартальных результатах команды</h1>
      </div>

      <CSVUploader onDrop={handleOnDrop} onClear={clearData} />

      {data.length > 0 && (
        <div>
          <div className="team-stats-section">
            {sortedTeamStats.map((stat) => (
              <Stats
                key={stat.team}
                count={stat.count}
                estimate={stat.estimate}
                teamName={stat.team}
                isSelected={selectedTeam === stat.team}
                onClick={() =>
                  setSelectedTeam((prev) =>
                    prev === stat.team ? null : stat.team
                  )
                }
                disabled={stat.count === 0}
              />
            ))}
          </div>

          <div className="grouped-charts-section">
            <Chart
              data={groupedStats.taskTypeStats}
              name="Распределение задач по типам"
              dataKey="count"
            />
            <Chart
              data={groupedStats.taskPriorityStats}
              name="Распределение задач по приоритету"
              dataKey="count"
            />
            <Chart
              data={groupedStats.estimateStats}
              name="Распределение эстимейта по задачам"
              dataKey="estimate"
            />
            <Chart
              data={groupedStats.taskAssigneeStats}
              name="Распределение задач по исполнителю"
              dataKey="count"
            />
            <Chart
              data={groupedStats.taskReporterStats}
              name="Распределение задач по менеджеру"
              dataKey="count"
            />
            <Chart
              data={groupedStats.labelStats}
              name="Распределение задач по лейблам"
              dataKey="count"
            />
            <Chart
              data={groupedStats.sprintStats}
              name="Распределение задач по спринтам"
              dataKey="count"
            />
          </div>

          <div className="table-section">
            <h2>{data.length} задач</h2>

            <Input
              value={globalFilter}
              onChange={handleSearchChange}
              onClear={handleClearSearch}
              placeholder="Поиск"
            />

            <DataTable data={data} globalFilter={globalFilter} />
          </div>
        </div>
      )}
    </div>
  );
};

export default QuarterlyReport;
