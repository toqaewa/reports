import "./Stats.css";

interface StatsProps {
  count: number;
  estimate: number;
  teamName: string;
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export const Stats: React.FC<StatsProps> = ({
  count,
  estimate,
  teamName,
  isSelected,
  onClick,
  disabled = false,
}) => {
  return (
    <button
      className={`stats-card 
        ${isSelected ? "stats-selected" : ""} 
        ${disabled ? "stats-disabled" : ""}
      `}
      onClick={onClick}
      disabled={disabled}
    >
      <h4>Команда {teamName}</h4>
      <div className="stats-summary">
        {/* TODO: сделать склонения */}
        <h3>{count} задач</h3>
        <span className="stats-estimate">{estimate} часов</span>
      </div>
    </button>
  );
};
