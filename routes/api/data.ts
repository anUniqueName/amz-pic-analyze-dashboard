import { Handlers } from "$fresh/server.ts";
import { 
  parseWatchBandData, 
  analyzeWatchBandData, 
  transformDataForDashboard 
} from "../../utils/dataProcessing.ts";

export const handler: Handlers = {
  async GET(_req) {
    try {
      // Read the JSON file from disk
      const jsonData = await Deno.readTextFile("./data/watch_band_analysis.json");
      
      // Process the data
      const processedData = parseWatchBandData(jsonData);
      const analysisResult = analyzeWatchBandData(processedData);
      const dashboardData = transformDataForDashboard(processedData, analysisResult);
      
      // Return as JSON
      return new Response(JSON.stringify(dashboardData), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error processing data:", error);
      
      // Return error response
      return new Response(
        JSON.stringify({ 
          error: `Error processing data: ${error.message}`,
          // Fallback to demo data if needed
          useFallback: true 
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  },
};
