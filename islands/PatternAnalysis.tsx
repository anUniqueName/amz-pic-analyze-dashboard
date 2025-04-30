import { useMemo } from 'preact/hooks';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Treemap
} from "recharts";
import DataCard from "../components/DataCard.tsx";
import CustomTooltip from "../components/CustomTooltip.tsx";

export default function PatternAnalysis({ 
  patternData, 
  correlationData, 
  segmentFilter, 
  onSelectItem 
}: { 
  patternData: any[],
  correlationData: any[],
  segmentFilter: string,
  onSelectItem: (item: any) => void
}) {
  // Filter data based on segment
  const filteredData = useMemo(() => {
    if (segmentFilter === 'all') return patternData;
    return patternData.filter(item => item[segmentFilter] > 0);
  }, [patternData, segmentFilter]);
  
  const patternMaterialCorrelations = useMemo(() => {
    return correlationData.filter(item => item.group === "Pattern-Material");
  }, [correlationData]);
  
  // Custom component for tree map
  const CustomizedContent = (props: any) => {
    const { root, depth, x, y, width, height, index, name, count } = props;
    
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: depth < 2 ? ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'][index % 5] : '#ffffff00',
            stroke: '#fff',
            strokeWidth: 2 / (depth + 1e-10),
            strokeOpacity: 1 / (depth + 1e-10),
          }}
        />
        {depth === 1 && (
          <text
            x={x + width / 2}
            y={y + height / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{
              fontSize: 14,
              fontWeight: 'bold',
              fill: '#fff',
            }}
          >
            {name}
          </text>
        )}
        {depth === 1 && (
          <text
            x={x + width / 2}
            y={y + height / 2 + 14}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{
              fontSize: 12,
              fill: '#fff',
            }}
          >
            {count}
          </text>
        )}
      </g>
    );
  };
  
  return (
    <div>
      <DataCard title="Pattern Type Analysis">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredData} margin={{ top: 10, right: 30, left: 20, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="count" name="Count" fill="#FF8042" onClick={onSelectItem} />
              <Bar dataKey="weighted" name="Weighted Score" fill="#82ca9d" onClick={onSelectItem} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </DataCard>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <DataCard title="Pattern Distribution">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <Treemap
                data={filteredData}
                dataKey="count"
                ratio={4/3}
                stroke="#fff"
                fill="#8884d8"
                content={<CustomizedContent />}
                onClick={onSelectItem}
              />
            </ResponsiveContainer>
          </div>
        </DataCard>
        
        <DataCard title="Pattern and Material Correlation">
          <div className="space-y-4">
            {patternMaterialCorrelations.map((corr, idx) => (
              <div 
                key={idx} 
                className="p-3 rounded bg-gray-50 cursor-pointer hover:bg-gray-100"
                onClick={() => onSelectItem(corr)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{corr.name}</h3>
                  <span className="text-sm text-gray-500">Score: {corr.score.toFixed(2)}</span>
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  <span>Count: {corr.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div 
                    className="bg-orange-400 h-2.5 rounded-full" 
                    style={{ width: `${(corr.score / 12) * 100}%` }}
                    aria-label={`Score: ${corr.score.toFixed(2)}`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </DataCard>
      </div>
    </div>
  );
}
