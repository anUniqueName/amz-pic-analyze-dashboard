import { useMemo } from 'preact/hooks';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell 
} from "recharts";
import DataCard from "../components/DataCard.tsx";
import CustomTooltip from "../components/CustomTooltip.tsx";

export default function ClosureAnalysis({ 
  closureData, 
  segmentFilter, 
  onSelectItem 
}: { 
  closureData: any[],
  segmentFilter: string,
  onSelectItem: (item: any) => void
}) {
  // Define color palette for charts
  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', 
    '#4CAF50', '#9C27B0', '#FF5722', '#607D8B', '#E91E63', 
    '#FFC107', '#3F51B5'
  ];

  // Filter data based on segment
  const filteredData = useMemo(() => {
    if (segmentFilter === 'all') return closureData;
    return closureData.filter(item => item[segmentFilter] > 0);
  }, [closureData, segmentFilter]);
  
  return (
    <div>
      <DataCard title="Closure Type Analysis">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredData} margin={{ top: 10, right: 30, left: 20, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="count" name="Count" fill="#8884d8" onClick={onSelectItem} />
              <Bar dataKey="weighted" name="Weighted Score" fill="#82ca9d" onClick={onSelectItem} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </DataCard>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <DataCard title="Closure Types by Popularity">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={filteredData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="name"
                  label={({name, percent}) => `${name.split(' ')[0]} (${(percent * 100).toFixed(0)}%)`}
                  onClick={onSelectItem}
                >
                  {filteredData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </DataCard>
        
        <DataCard title="Closure Type Cards">
          <div className="grid grid-cols-2 gap-4">
            {filteredData.slice(0, 6).map((closure, idx) => (
              <div 
                key={idx} 
                className="p-3 rounded bg-gray-50 cursor-pointer hover:bg-gray-100"
                onClick={() => onSelectItem(closure)}
              >
                <h3 className="font-medium text-sm">{closure.name}</h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">Count: {closure.count}</span>
                  <span className="text-xs text-gray-500">Score: {closure.weighted.toFixed(2)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full" 
                    style={{ width: `${(closure.weighted / 10) * 100}%` }}
                    aria-label={`Score: ${closure.weighted.toFixed(2)}`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          {filteredData.length > 6 && (
            <div className="text-center mt-4">
              <button 
                className="text-blue-600 text-sm hover:underline"
                onClick={() => onSelectItem({name: "All Closure Types", items: filteredData})}
              >
                View All ({filteredData.length})
              </button>
            </div>
          )}
        </DataCard>
      </div>
    </div>
  );
}
