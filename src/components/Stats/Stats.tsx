import "./Stats.css";

interface StatsProps {
  count: number;
  estimate: number;
  teamName: string;
  isSelected: boolean;
  onClick: () => void;
}

export const Stats: React.FC<StatsProps> = ({ count, estimate, teamName, isSelected, onClick }) => {
  return (
    <button className={`stats-card ${isSelected ? 'stats-selected' : ''}`} onClick={onClick}>
      <h4>Команда {teamName}</h4>
      <div className="stats-summary">
        <h3>{count} задач</h3>
        <span className="stats-estimate">{estimate} часов</span>
      </div>
    </button>
  );
};
