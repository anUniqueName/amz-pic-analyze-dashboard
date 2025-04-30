// islands/MaterialAnalysis.tsx
import { useState, useCallback, useMemo } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import DataCard from "../components/DataCard.tsx";
import ChartContainer from "../components/ChartContainer.tsx";
import CustomTooltip from "../components/CustomTooltip.tsx";
import { useFilteredData } from "../utils/chartHelpers.ts";

interface MaterialDataItem {
  name: string;
  count: number;
  weighted: number;
  top10: number;
  top50: number;
  top100: number;
}

interface MaterialAnalysisProps {
  materialData: MaterialDataItem[];
  segmentFilter: string;
  onSelectItem: (item: MaterialDataItem) => void;
}

export default function MaterialAnalysis({ materialData, segmentFilter, onSelectItem }: MaterialAnalysisProps) {
  const filteredData = useFilteredData(materialData, segmentFilter);
  
  if (!IS_BROWSER) {
    return <div>Loading Material Analysis...</div>;
  }
  
  return (
    <div>
      <DataCard title="Material Analysis">
        <ChartContainer height={80}>
          <BarChart data={filteredData} margin={{ top: 10, right: 30, left: 20, bottom: 50 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} />
            <Bar yAxisId="left" dataKey="count" name="Count" fill="#8884d8" onClick={onSelectItem} />
            <Bar yAxisId="right" dataKey="weighted" name="Weighted Score" fill="#82ca9d" onClick={onSelectItem} />
          </BarChart>
        </ChartContainer>
      </DataCard>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <DataCard title="Material Distribution by Ranking">
          <ChartContainer height={80}>
            <BarChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="top10" name="Top 10" stackId="a" fill="#8884d8" onClick={onSelectItem} />
              <Bar dataKey="top50" name="Top 50" stackId="a" fill="#82ca9d" onClick={onSelectItem} />
              <Bar dataKey="count" name="All" stackId="a" fill="#FF8042" onClick={onSelectItem} />
            </BarChart>
          </ChartContainer>
        </DataCard>
        
        <DataCard title="Material Insights">
          <div className="space-y-4">
            {filteredData.map((material, idx) => (
              <div 
                key={idx} 
                className="p-3 rounded bg-gray-50 cursor-pointer hover:bg-gray-100"
                onClick={() => onSelectItem(material)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{material.name}</h3>
                  <span className="text-sm text-gray-500">Score: {material.weighted.toFixed(2)}</span>
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  <span>Count: {material.count}</span>
                  <span className="mx-2">|</span>
                  <span>Top 10: {material.top10}</span>
                  <span className="mx-2">|</span>
                  <span>Top 50: {material.top50}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${(material.weighted / (filteredData[0]?.weighted || 20)) * 100}%` }}
                    aria-label={`Score: ${material.weighted.toFixed(2)}`}
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
