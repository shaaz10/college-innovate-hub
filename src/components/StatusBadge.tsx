import { stageLabels } from "@/data/mockData";

interface StatusBadgeProps {
  stage: number;
  className?: string;
}

const StatusBadge = ({ stage, className = "" }: StatusBadgeProps) => {
  const getStatusStyle = (stageNum: number) => {
    if (stageNum <= 3) return "status-idea";
    if (stageNum <= 6) return "status-development"; 
    return "status-funded";
  };
  
  return (
    <span className={`status-badge ${getStatusStyle(stage)} ${className}`}>
      {stageLabels[stage - 1]}
    </span>
  );
};

export default StatusBadge;