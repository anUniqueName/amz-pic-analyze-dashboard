import { Handlers, PageProps } from "$fresh/server.ts";
import Dashboard from "../islands/Dashboard.tsx";

interface DashboardData {
  materialData: any[];
  closureData: any[];
  patternData: any[];
  colorData: any[];
  colorGroups: any[];
  correlationData: any[];
  topRankingsData: any[];
  priceTierData: any[];
}

export const handler: Handlers<DashboardData | null> = {
  async GET(_, ctx) {
    try {
      // Fetch the processed data from our API
      const resp = await fetch(`${new URL(_.url).origin}/api/data`);
      if (!resp.ok) {
        throw new Error(`Failed to fetch data: ${resp.statusText}`);
      }
      
      const data = await resp.json();
      return ctx.render(data);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      return ctx.render(null);
    }
  },
};

export default function Home({ data }: PageProps<DashboardData | null>) {
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Apple Watch Band Market Analysis</h1>
          {data ? (
            <p className="text-gray-600 mt-1">
              Analyzing {data.materialData.reduce((sum, item) => sum + item.count, 0)} watch bands from Amazon bestsellers
            </p>
          ) : (
            <p className="text-gray-600 mt-1">Loading watch band data...</p>
          )}
        </header>
        
        {data ? (
          <Dashboard data={data} />
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-600">
              Error loading data. Please check the server logs or try again later.
            </p>
          </div>
        )}
        
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Analysis based on Amazon bestseller ranking data. Click on chart elements for detailed information.</p>
        </div>
      </div>
    </div>
  );
}
