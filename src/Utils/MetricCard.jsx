
import { HiMiniArrowDownRight, HiMiniArrowRight, HiMiniArrowUpRight } from "react-icons/hi2";

const MetricCard = ({ parameter, value, normalRange, status, explanation, trend }) => {
  const statusColors = {
    normal: 'border-green-200 bg-green-50',
    warning: 'border-yellow-200 bg-yellow-50',
    alert: 'border-red-200 bg-red-50'
  };

  const statusBadgeColors = {
    normal: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    alert: 'bg-red-100 text-red-700'
  };

  const trendIcons = {
    up: <HiMiniArrowUpRight className="bg-green-400 p-1 rounded-md text-white text-xl"/>,
    down: <HiMiniArrowDownRight className="bg-green-400 p-1 rounded-md text-white text-xl"/>,
    stable: <HiMiniArrowRight className="bg-green-400 p-1 rounded-md text-white text-xl"/>
  };

  return (
    <div className={`border-2 rounded-xl p-5 ${statusColors[status] || 'border-gray-200 bg-gray-50'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-bold text-lg text-gray-800 mb-1">{parameter}</h4>
          <p className="text-sm text-gray-600">Normal: {normalRange}</p>
        </div>
        <div className="text-right ml-4">
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          {trend && (
            <span className="text-sm text-gray-600 flex items-center justify-end gap-1 mt-1">
              <span>{trendIcons[trend]}</span>
              <span className="capitalize">{trend}</span>
            </span>
          )}
        </div>
      </div>
      
      <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${statusBadgeColors[status]}`}>
        {status.toUpperCase()}
      </div>
      
      <p className="text-sm text-gray-700 leading-relaxed">{explanation}</p>
    </div>
  );
};

export default MetricCard;
