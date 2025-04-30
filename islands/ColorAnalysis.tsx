import { useMemo, useCallback } from 'preact/hooks';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, PieChart, Pie, Cell 
} from "recharts";
import DataCard from "../components/DataCard.tsx";
import CustomTooltip from "../components/CustomTooltip.tsx";

export default function ColorAnalysis({ 
  colorData, 
  colorGroups, 
  activeView, 
  setActiveView, 
  segmentFilter, 
  onSelectItem 
}: { 
  colorData: any[],
  colorGroups: any[],
  activeView: string,
  setActiveView: (view: string) => void,
  segmentFilter: string,
  onSelectItem: (item: any) => void
}) {
  // Define color palette for charts
  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', 
    '#4CAF50', '#9C27B0', '#FF5722', '#607D8B', '#E91E63', 
    '#FFC107', '#3F51B5'
  ];

  // Get filtered data based on current filter and view
  const getActiveData = useCallback(() => {
    const baseData = activeView === 'detailed' ? colorData : colorGroups;
    if (segmentFilter === 'all') return baseData;
    return baseData.filter(item => item[segmentFilter] > 0);
  }, [activeView, segmentFilter, colorData, colorGroups]);

  const activeData = useMemo(() => getActiveData(), [getActiveData]);

  return (
    <div>
      <DataCard title="Color Analysis">
        <div className="flex flex-wrap items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Color Analysis</h2>
          <div className="flex space-x-2">
            <button 
              className={`px-3 py-1 rounded text-sm font-medium ${activeView === 'grouped' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveView('grouped')}
            >
              Grouped View
            </button>
            <button 
              className={`px-3 py-1 rounded text-sm font-medium ${activeView === 'detailed' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveView('detailed')}
            >
              Detailed View
            </button>
          </div>
        </div>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activeData} margin={{ top: 10, right: 30, left: 20, bottom: 70 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} />
              <Bar yAxisId="left" dataKey="count" name="Count" fill="#8884d8" onClick={onSelectItem}>
                {activeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.value || COLORS[index % COLORS.length]} />
                ))}
              </Bar>
              <Bar yAxisId="right" dataKey="weighted" name="Weighted Score" fill="#82ca9d" onClick={onSelectItem} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </DataCard>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <DataCard title="Color Distribution by Ranking">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={90} data={activeData.slice(0, 5)}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                <Radar name="Top 10" dataKey="top10" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Radar name="Top 50" dataKey="top50" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                <Tooltip />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </DataCard>
        
        <DataCard title="Color Swatches">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {activeData.map((color, idx) => (
              <div 
                key={idx} 
                className="p-3 rounded border border-gray-200 cursor-pointer hover:bg-gray-50"
                onClick={() => onSelectItem(color)}
              >
                <div 
                  className="w-full h-12 rounded mb-2"
                  style={{ backgroundColor: color.value || COLORS[idx % COLORS.length] }}
                  aria-label={`Color: ${color.name}`}
                ></div>
                <div className="text-sm font-medium truncate">{color.name}</div>
                <div className="text-xs text-gray-500">Count: {color.count}</div>
              </div>
            ))}
          </div>
        </DataCard>
      </div>
    </div>
  );
}
