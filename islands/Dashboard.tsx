import { useState, useCallback } from "preact/hooks";
import DashboardView from "./DashboardView.tsx";
import ColorAnalysis from "./ColorAnalysis.tsx";
import MaterialAnalysis from "./MaterialAnalysis.tsx";
import ClosureAnalysis from "./ClosureAnalysis.tsx";
import PatternAnalysis from "./PatternAnalysis.tsx";
import CorrelationsView from "./CorrelationsView.tsx";
import DetailView from "../components/DetailView.tsx";
import Tab from "../components/Tab.tsx";

export default function Dashboard({ data }: { data: any }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeView, setActiveView] = useState('grouped');
  const [segmentFilter, setSegmentFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Memoized handler for item selection
  const handleSelectItem = useCallback((item: any) => {
    setSelectedItem(item);
  }, []);
  
  // Handler for closing the detail view
  const handleCloseDetail = useCallback(() => {
    setSelectedItem(null);
  }, []);
  
  return (
    <div>
      <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap gap-2 justify-between items-center">
          <div className="space-x-2 flex flex-wrap gap-2">
            <Tab 
              label="Dashboard" 
              active={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')} 
            />
            <Tab 
              label="Colors" 
              active={activeTab === 'colors'} 
              onClick={() => {setActiveTab('colors'); setActiveView('grouped');}} 
            />
            <Tab 
              label="Materials" 
              active={activeTab === 'materials'} 
              onClick={() => setActiveTab('materials')} 
            />
            <Tab 
              label="Closures" 
              active={activeTab === 'closures'} 
              onClick={() => setActiveTab('closures')} 
            />
            <Tab 
              label="Patterns" 
              active={activeTab === 'patterns'} 
              onClick={() => setActiveTab('patterns')} 
            />
            <Tab 
              label="Correlations" 
              active={activeTab === 'correlations'} 
              onClick={() => setActiveTab('correlations')} 
            />
          </div>
          
          <div>
            <select 
              className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={segmentFilter}
              onChange={(e) => setSegmentFilter((e.target as HTMLSelectElement).value)}
              aria-label="Ranking filter"
            >
              <option value="all">All Rankings</option>
              <option value="top10">Top 10 Only</option>
              <option value="top50">Top 50 Only</option>
            </select>
          </div>
        </div>
      </div>
      
      {activeTab === 'dashboard' && (
        <DashboardView 
          colorGroups={data.colorGroups} 
          materialData={data.materialData}
          closureData={data.closureData}
          patternData={data.patternData}
          topRankingsData={data.topRankingsData}
          priceTierData={data.priceTierData}
          onSelectItem={handleSelectItem}
        />
      )}

      {activeTab === 'colors' && (
        <ColorAnalysis 
          colorData={data.colorData}
          colorGroups={data.colorGroups}
          activeView={activeView}
          setActiveView={setActiveView}
          segmentFilter={segmentFilter}
          onSelectItem={handleSelectItem}
        />
      )}

      {activeTab === 'materials' && (
        <MaterialAnalysis 
          materialData={data.materialData}
          segmentFilter={segmentFilter}
          onSelectItem={handleSelectItem}
        />
      )}

      {activeTab === 'closures' && (
        <ClosureAnalysis 
          closureData={data.closureData}
          segmentFilter={segmentFilter}
          onSelectItem={handleSelectItem}
        />
      )}

      {activeTab === 'patterns' && (
        <PatternAnalysis 
          patternData={data.patternData}
          correlationData={data.correlationData}
          segmentFilter={segmentFilter}
          onSelectItem={handleSelectItem}
        />
      )}

      {activeTab === 'correlations' && (
        <CorrelationsView 
          correlationData={data.correlationData}
          topRankingsData={data.topRankingsData}
          onSelectItem={handleSelectItem}
        />
      )}
      
      {selectedItem && (
        <DetailView 
          item={selectedItem} 
          onClose={handleCloseDetail} 
        />
      )}
    </div>
  );
}
