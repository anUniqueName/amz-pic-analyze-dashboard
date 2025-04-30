import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, LabelList
} from "recharts";
import DataCard from "../components/DataCard.tsx";
import CustomTooltip from "../components/CustomTooltip.tsx";

// Dashboard view component
export default function DashboardView({ 
  colorGroups, 
  materialData, 
  closureData, 
  patternData, 
  topRankingsData, 
  priceTierData, 
  onSelectItem 
}: { 
  colorGroups: any[], 
  materialData: any[], 
  closureData: any[], 
  patternData: any[], 
  topRankingsData: any[], 
  priceTierData: any[], 
  onSelectItem: (item: any) => void 
}) {
  // Define color palette for charts
  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', 
    '#4CAF50', '#9C27B0', '#FF5722', '#607D8B', '#E91E63', 
    '#FFC107', '#3F51B5'
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <DataCard title="Color Distribution">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={colorGroups}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                nameKey="name"
                label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
                labelLine={false}
                onClick={onSelectItem}
              >
                {colorGroups.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.value} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 text-sm text-gray-600">
          <p>Click on segments for detailed information</p>
        </div>
      </DataCard>
      
      <DataCard title="Material Popularity">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={materialData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#82ca9d" onClick={onSelectItem} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </DataCard>
      
      <DataCard title="Closure Type Distribution">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={closureData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#8884d8" onClick={onSelectItem} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </DataCard>
      
      <DataCard title="Pattern Type Distribution">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={patternData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#FF8042" onClick={onSelectItem} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </DataCard>
      
      <DataCard title="Top 10 Product Combinations" className="col-span-1 md:col-span-2">
        <div className="h-72">
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
      
      <DataCard title="Price Tier Analysis" className="col-span-1 md:col-span-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {priceTierData.map((tier, idx) => (
            <div 
              key={idx} 
              className="bg-gray-50 p-4 rounded cursor-pointer hover:bg-gray-100"
              onClick={() => onSelectItem(tier)}
            >
              <h3 className="font-semibold text-lg">{tier.name}</h3>
              <p className="text-3xl font-bold my-2">{tier.percentage}%</p>
              <p className="text-sm text-gray-600">Count: {tier.count} bands</p>
              <div className="mt-2">
                <p className="text-xs font-semibold text-gray-500">TOP MATERIALS:</p>
                <p className="text-sm">{tier.topMaterials.join(", ")}</p>
              </div>
              <div className="mt-1">
                <p className="text-xs font-semibold text-gray-500">TOP COLORS:</p>
                <p className="text-sm">{tier.topColors.join(", ")}</p>
              </div>
            </div>
          ))}
        </div>
      </DataCard>
    </div>
  );
}
