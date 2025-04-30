import { useMemo } from 'preact/hooks';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList, ResponsiveContainer 
} from "recharts";
import DataCard from "../components/DataCard.tsx";
import CustomTooltip from "../components/CustomTooltip.tsx";

export default function CorrelationsView({ 
  correlationData, 
  topRankingsData, 
  onSelectItem 
}: { 
  correlationData: any[],
  topRankingsData: any[],
  onSelectItem: (item: any) => void
}) {
  // Group correlations by type
  const materialColorCorrelations = useMemo(() => 
    correlationData.filter(item => item.group === "Material-Color"), [correlationData]);
  
  const materialClosureCorrelations = useMemo(() => 
    correlationData.filter(item => item.group === "Material-Closure"), [correlationData]);
  
  const patternMaterialCorrelations = useMemo(() => 
    correlationData.filter(item => item.group === "Pattern-Material"), [correlationData]);
  
  return (
    <div>
      <DataCard title="Feature Correlations">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Material-Color Combinations</h3>
            <div className="space-y-2">
              {materialColorCorrelations.map((corr, idx) => (
                <div 
                  key={idx} 
                  className="bg-white p-2 rounded cursor-pointer hover:bg-gray-50"
                  onClick={() => onSelectItem(corr)}
                >
                  <div className="flex justify-between items-center">
                    <span>{corr.name}</span>
                    <span className="text-sm text-gray-500">{corr.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full" 
                      style={{ width: `${(corr.score / 10) * 100}%` }}
                      aria-label={`Score: ${corr.score.toFixed(2)}`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-green-50 rounded p-4">
            <h3 className="font-semibold text-green-800 mb-2">Material-Closure Combinations</h3>
            <div className="space-y-2">
              {materialClosureCorrelations.map((corr, idx) => (
                <div 
                  key={idx} 
                  className="bg-white p-2 rounded cursor-pointer hover:bg-gray-50"
                  onClick={() => onSelectItem(corr)}
                >
                  <div className="flex justify-between items-center">
                    <span>{corr.name}</span>
                    <span className="text-sm text-gray-500">{corr.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div 
                      className="bg-green-600 h-1.5 rounded-full" 
                      style={{ width: `${(corr.score / 10) * 100}%` }}
                      aria-label={`Score: ${corr.score.toFixed(2)}`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-purple-50 rounded p-4">
            <h3 className="font-semibold text-purple-800 mb-2">Pattern-Material Combinations</h3>
            <div className="space-y-2">
              {patternMaterialCorrelations.map((corr, idx) => (
                <div 
                  key={idx} 
                  className="bg-white p-2 rounded cursor-pointer hover:bg-gray-50"
                  onClick={() => onSelectItem(corr)}
                >
                  <div className="flex justify-between items-center">
                    <span>{corr.name}</span>
                    <span className="text-sm text-gray-500">{corr.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div 
                      className="bg-purple-600 h-1.5 rounded-full" 
                      style={{ width: `${(corr.score / 12) * 100}%` }}
                      aria-label={`Score: ${corr.score.toFixed(2)}`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DataCard>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <DataCard title="Top Product Combinations">
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topRankingsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="score" fill="#8884d8" onClick={onSelectItem}>
                  <LabelList dataKey="rank" position="right" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DataCard>
        
        <DataCard title="Key Insights">
          <div className="space-y-4">
            <div className="bg-blue-50 p-3 rounded">
              <h3 className="font-semibold text-blue-800">Black Silicone Dominance</h3>
              <p className="text-sm mt-1">Black silicone sport bands are the most popular combination, with the highest aggregate score of 7.25.</p>
            </div>
            
            <div className="bg-green-50 p-3 rounded">
              <h3 className="font-semibold text-green-800">Material-Closure Compatibility</h3>
              <p className="text-sm mt-1">Each material has a preferred closure type: silicone with pin-and-tuck (score 9.65), nylon with sliding buckle (6.28), and steel with magnetic closures (5.34).</p>
            </div>
            
            <div className="bg-purple-50 p-3 rounded">
              <h3 className="font-semibold text-purple-800">Pattern-Material Synergy</h3>
              <p className="text-sm mt-1">Woven patterns are almost exclusively found with nylon materials (10.25), while solid patterns dominate in silicone bands (11.42).</p>
            </div>
            
            <div className="bg-yellow-50 p-3 rounded">
              <h3 className="font-semibold text-yellow-800">Color-Material Preference</h3>
              <p className="text-sm mt-1">Black and white dominate in silicone bands, while metallics (silver/gold) are predominantly found in stainless steel bands.</p>
            </div>
          </div>
        </DataCard>
      </div>
    </div>
  );
}
