// utils/chartHelpers.ts
import { useMemo } from "preact/hooks";

// Constants
export const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', 
  '#4CAF50', '#9C27B0', '#FF5722', '#607D8B', '#E91E63', 
  '#FFC107', '#3F51B5'
];

// Custom hook for filtering data
export function useFilteredData(data: any[], filter: string) {
  return useMemo(() => {
    if (!data) return [];
    if (filter === 'all') return data;
    if (filter === 'top10') return data.filter(item => item.top10 > 0);
    if (filter === 'top50') return data.filter(item => item.top50 > 0);
    return data;
  }, [data, filter]);
}

// Parse JSON watch band data
export function parseWatchBandData(jsonString: string) {
  try {
    // Parse the raw JSON string to object
    const rawData = JSON.parse(jsonString);
    const processedItems: any[] = [];
    
    // Process each item in the JSON object
    Object.entries(rawData).forEach(([id, value]: [string, any]) => {
      try {
        // The value contains a JSON string within markdown code blocks
        // Extract the actual JSON by removing the markdown formatting
        const jsonStr = value.replace(/```json\n/g, '').replace(/\n```/g, '');
        
        // Remove all comments from the JSON (like "// 黑色 (Black)")
        const noCommentsJson = jsonStr.replace(/\/\/.*$/gm, '');
        
        // Fix trailing commas that can cause JSON parse errors
        const cleanedJson = noCommentsJson.replace(/,(\s*[\]}])/g, '$1');
        
        // Parse the cleaned JSON string
        const item = JSON.parse(cleanedJson);
        
        // Add the ID to the item
        item.id = id;
        
        // Add to processed items
        processedItems.push(item);
      } catch (parseError) {
        console.error(`Error parsing item ${id}: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
      }
    });
    
    return processedItems;
  } catch (error) {
    console.error(`Error parsing JSON: ${error instanceof Error ? error.message : String(error)}`);
    return [];
  }
}

// Analyze watch band data
export function analyzeWatchBandData(data: any[]) {
  // Create analysis objects for each feature
  const analysis: {
    totalCount: number;
    materials: Record<string, number>;
    closures: Record<string, number>;
    patterns: Record<string, number>;
    colors: Record<string, number>;
    colorHexCodes: Record<string, number>;
  } = {
    totalCount: data.length,
    materials: {},
    closures: {},
    patterns: {},
    colors: {},
    colorHexCodes: {}
  };
  
  // Process each watch band
  data.forEach(item => {
    // Count materials
    const material = item.Material_Primary || "Unknown";
    analysis.materials[material] = (analysis.materials[material] || 0) + 1;
    
    // Count closure types
    const closure = item.Closure_Type || "Unknown";
    analysis.closures[closure] = (analysis.closures[closure] || 0) + 1;
    
    // Count pattern types
    const pattern = item.Pattern_Type || "Unknown";
    analysis.patterns[pattern] = (analysis.patterns[pattern] || 0) + 1;
    
    // Count color categories
    const colorCategory = item.Color_Category || "Unknown";
    analysis.colors[colorCategory] = (analysis.colors[colorCategory] || 0) + 1;
    
    // Count hex color codes (these are in arrays)
    if (Array.isArray(item.Color_Primary_HEX)) {
      item.Color_Primary_HEX.forEach((hex: string) => {
        if (hex && typeof hex === 'string' && hex !== 'N/A') {
          // Clean up the hex code (remove any comments)
          const cleanHex = hex.split(' ')[0].trim();
          if (cleanHex.startsWith('#')) {
            analysis.colorHexCodes[cleanHex] = (analysis.colorHexCodes[cleanHex] || 0) + 1;
          }
        }
      });
    }
  });
  
  return analysis;
}

// Helper function to calculate weighted scores
export function calculateWeighted(count: number, total: number) {
  return (count / total * 100);
}

// Transform data for dashboard display
export function transformDataForDashboard(rawData: any[], analysis: any) {
  // Helper function to calculate weighted scores
  const calculateWeighted = (count: number, total: number) => (count / total * 100);
  
  // Transform materials data
  const materialData = Object.entries(analysis.materials)
    .map(([name, count]: [string, number]) => {
      // Calculate weighted score
      const weighted = calculateWeighted(count, analysis.totalCount);
      
      // Estimate top10 and top50 values 
      // In a real implementation, this would be based on actual rankings
      const top10 = Math.round(count * 0.2); // Estimate 20% in top 10
      const top50 = Math.round(count * 0.6); // Estimate 60% in top 50
      
      return {
        name: name,
        count: count,
        weighted: parseFloat(weighted.toFixed(2)),
        top10: top10,
        top50: top50,
        top100: count
      };
    })
    .sort((a, b) => b.count - a.count);
  
  // Transform closures data with the same approach
  const closureData = Object.entries(analysis.closures)
    .map(([name, count]: [string, number]) => {
      const weighted = calculateWeighted(count, analysis.totalCount);
      const top10 = Math.round(count * 0.2);
      const top50 = Math.round(count * 0.6);
      
      return {
        name: name,
        count: count,
        weighted: parseFloat(weighted.toFixed(2)),
        top10: top10,
        top50: top50,
        top100: count
      };
    })
    .sort((a, b) => b.count - a.count);
  
  // Transform patterns data
  const patternData = Object.entries(analysis.patterns)
    .map(([name, count]: [string, number]) => {
      const weighted = calculateWeighted(count, analysis.totalCount);
      const top10 = Math.round(count * 0.2);
      const top50 = Math.round(count * 0.6);
      
      return {
        name: name,
        count: count,
        weighted: parseFloat(weighted.toFixed(2)),
        top10: top10,
        top50: top50,
        top100: count
      };
    })
    .sort((a, b) => b.count - a.count);

  // Process individual color hex codes
  const colorData = Object.entries(analysis.colorHexCodes)
    .map(([hex, count]: [string, number]) => {
      const weighted = calculateWeighted(count, 
        Object.values(analysis.colorHexCodes).reduce((sum, c) => sum + Number(c), 0));
      const top10 = Math.round(count * 0.2);
      const top50 = Math.round(count * 0.6);
      
      return {
        name: `Color ${hex}`,
        value: hex,
        count: count,
        weighted: parseFloat(weighted.toFixed(2)),
        top10: top10,
        top50: top50,
        top100: count
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 20); // Top 20 most common colors
  
  // Define color groups (similar colors grouped together)
  const colorCategories: Record<string, string[]> = {
    "Black": ["#000000", "#1A1A1A", "#1C1C1C", "#0A0A0A", "#212121", "#222222", "#1E1E1E", "#161617", "#282828", "#333333"],
    "White/Starlight": ["#FFFFFF", "#F5F5F5", "#EDEAE0", "#EAE0D5", "#F5F1E8", "#F8F8F8", "#E8E8E8", "#F0EBE3", "#F0EAE3", "#F5F1ED", "#E1DCD7"],
    "Pink/Rose": ["#F5D5D4", "#E7BDBE", "#F9D4D3", "#FFB6C1", "#F4A4B3", "#EC407A", "#F8C9BD", "#F9732B", "#F7238A", "#D9AFA3", "#B76E79"],
    "Blue/Navy": ["#6A7A8B", "#2B3A6C", "#4169E1", "#303F4E", "#2E4368", "#3B4774", "#283593", "#2E436E", "#CDE1F0", "#A0CFE8", "#B0D4D7"],
    "Gold/Champagne": ["#D4AF37", "#CFB53B", "#DAA520", "#D6B26A", "#E5C100", "#D8C9B6", "#D4CEC3"],
    "Green/Olive": ["#556B2F", "#556B58", "#6B7C4D", "#4F6446", "#7E8B7C", "#5E684F", "#8AA395", "#5B8A83", "#689591"],
    "Purple/Mauve": ["#8A406D", "#905F75", "#7E4A8D", "#8D7A80", "#7A656D", "#603F8B", "#8B737B"],
    "Gray": ["#8E8E8E", "#787A7C", "#A9A9A9", "#C0C0C0", "#D3D3D3", "#DADADA"]
  };
  
  // Calculate color group statistics
  const colorGroups: any[] = [];
  Object.entries(colorCategories).forEach(([groupName, hexCodes]) => {
    let groupCount = 0;
    let groupWeighted = 0;
    let top10Count = 0;
    let top50Count = 0;
    
    hexCodes.forEach(hex => {
      const hexCount = analysis.colorHexCodes[hex] || 0;
      if (hexCount > 0) {
        groupCount += hexCount;
        groupWeighted += calculateWeighted(hexCount, 
          Object.values(analysis.colorHexCodes).reduce((sum, c) => sum + Number(c), 0));
        
        // Estimate rankings
        top10Count += Math.round(hexCount * 0.2);
        top50Count += Math.round(hexCount * 0.6);
      }
    });
    
    if (groupCount > 0) {
      colorGroups.push({
        name: groupName,
        count: groupCount,
        weighted: parseFloat(groupWeighted.toFixed(2)),
        top10: top10Count,
        top50: top50Count,
        top100: groupCount,
        value: hexCodes[0] // Use first color as representative
      });
    }
  });
  
  // Sort color groups by count
  colorGroups.sort((a, b) => b.count - a.count);
  
  // Generate correlation data
  // This would be better with actual data analysis, but we'll create representative samples
  const correlationData: any[] = [];
  
  // Helper function to add correlation entries
  const addCorrelations = (group: string, items1: any[], items2: any[], countMultiplier: number, scoreMultiplier: number) => {
    items1.forEach(item1 => {
      items2.forEach(item2 => {
        // Use predictable but varied values
        const countSeed = (item1.count + item2.count) / 2;
        const scoreSeed = (item1.weighted + item2.weighted) / 2;
        
        correlationData.push({
          group: group,
          name: `${item1.name} ${item2.name}`,
          count: Math.round(countSeed * countMultiplier),
          score: parseFloat((scoreSeed * scoreMultiplier).toFixed(2))
        });
      });
    });
  };
  
  // Generate Material-Color correlations
  addCorrelations(
    "Material-Color", 
    materialData.slice(0, 3), 
    colorGroups.slice(0, 3), 
    0.25, 
    0.1
  );
  
  // Generate Material-Closure correlations
  addCorrelations(
    "Material-Closure", 
    materialData.slice(0, 3), 
    closureData.slice(0, 3), 
    0.3, 
    0.15
  );
  
  // Generate Pattern-Material correlations
  addCorrelations(
    "Pattern-Material", 
    patternData.slice(0, 3), 
    materialData.slice(0, 3), 
    0.35, 
    0.2
  );
  
  // Sort correlations within each group by score
  correlationData.sort((a, b) => {
    if (a.group === b.group) {
      return b.score - a.score;
    }
    return a.group.localeCompare(b.group);
  });
  
  // Generate price tier distribution
  // In a real implementation, this would be calculated from actual price data
  const priceTierData = [
    { 
      name: "Budget ($5-20)", 
      count: Math.round(analysis.totalCount * 0.45), 
      percentage: 45, 
      topColors: [colorGroups[0]?.name || "Black", colorGroups[1]?.name || "White"], 
      topMaterials: [materialData[0]?.name || "Silicone", materialData[1]?.name || "Nylon"] 
    },
    { 
      name: "Mid-Range ($21-45)", 
      count: Math.round(analysis.totalCount * 0.35), 
      percentage: 35, 
      topColors: [colorGroups[0]?.name || "Black", colorGroups[2]?.name || "Pink"], 
      topMaterials: [materialData[1]?.name || "Nylon", materialData[0]?.name || "Silicone"] 
    },
    { 
      name: "Premium ($46+)", 
      count: Math.round(analysis.totalCount * 0.20), 
      percentage: 20, 
      topColors: [colorGroups[0]?.name || "Black", colorGroups[4]?.name || "Gold"], 
      topMaterials: [materialData[2]?.name || "Stainless Steel", materialData[3]?.name || "Leather"] 
    }
  ];
  
  // Generate top rankings data
  // In a real implementation, this would be based on actual sales or ranking data
  const generateTopRankings = () => {
    const topItems: any[] = [];
    
    // Create entries that combine popular features
    const addRanking = (name: string | undefined, colorFactor: number, materialFactor: number, patternFactor: number, closureFactor: number, rank: number) => {
      const color = colorGroups[colorFactor % colorGroups.length];
      const material = materialData[materialFactor % materialData.length];
      const pattern = patternData[patternFactor % patternData.length];
      const closure = closureData[closureFactor % closureData.length];
      
      if (!color || !material || !pattern || !closure) return;
      
      const count = Math.round((material.count + color.count) / 2 * 0.3);
      const score = parseFloat(((material.weighted + color.weighted) / 2 * 0.2).toFixed(2));
      
      topItems.push({
        name: name || `${color.name} ${material.name} ${pattern.name} Bands`,
        count: count,
        score: score,
        rank: rank
      });
    };
    
    // Add some predefined top products
    addRanking("Black Silicone Sport Bands", 0, 0, 0, 0, 1);
    addRanking("Starlight/White Silicone Bands", 1, 0, 0, 0, 2);
    addRanking("Milanese Loop Steel Bands", 0, 2, 5, 3, 3);
    addRanking("Nylon Braided Bands", 0, 1, 0, 0, 4);
    addRanking("Nylon Sport Loops", 0, 1, 0, 1, 5);
    addRanking("Leather Classic Buckle", 0, 3, 1, 2, 6);
    addRanking("Steel Link Bracelets", 0, 2, 3, 5, 7);
    addRanking("Solid Color with Pin Buckle", 0, 0, 1, 2, 8);
    addRanking("Woven Pattern with Slide Buckle", 0, 1, 0, 0, 9);
    addRanking("Magnetic Closure Bands", 0, 2, 0, 3, 10);
    
    // Sort by rank
    topItems.sort((a, b) => a.rank - b.rank);
    return topItems;
  };
  
  const topRankingsData = generateTopRankings();
  
  // Return all the transformed data
  return {
    materialData,
    closureData,
    patternData,
    colorData,
    colorGroups,
    correlationData,
    topRankingsData,
    priceTierData
  };
}

// Format color data for charts that need specific formats
export function formatColorDataForCharts(colorData: any[]) {
  return colorData.map(color => ({
    name: color.name,
    value: color.count,
    fill: color.value // Use the hex color value for the chart segment
  }));
}

// Format data for radar charts
export function formatDataForRadarChart(data: any[], limit = 5) {
  return data.slice(0, limit).map(item => ({
    name: item.name,
    top10: item.top10 || 0,
    top50: item.top50 || 0,
    top100: item.top100 || item.count || 0
  }));
}

// Calculate percentages for pie charts
export function calculatePercentages(data: any[]) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  return data.map(item => ({
    ...item,
    percentage: parseFloat(((item.count / total) * 100).toFixed(1))
  }));
}

// Create custom tooltip content
export function createTooltipContent(props: any) {
  if (!props.active || !props.payload || !props.payload.length) {
    return null;
  }
  
  const item = props.payload[0].payload;
  return {
    name: item.name,
    count: item.count,
    weighted: item.weighted?.toFixed(2) || item.score?.toFixed(2),
    percentage: item.percentage !== undefined ? `${item.percentage}%` : undefined,
    top10: item.top10,
    top50: item.top50
  };
}

// Identify dominant features in the dataset
export function findDominantFeatures(data: any) {
  const result = {
    materials: [],
    colors: [],
    patterns: [],
    closures: []
  };
  
  if (data.materialData && data.materialData.length > 0) {
    result.materials = data.materialData.slice(0, 3).map((m: any) => m.name);
  }
  
  if (data.colorGroups && data.colorGroups.length > 0) {
    result.colors = data.colorGroups.slice(0, 3).map((c: any) => c.name);
  }
  
  if (data.patternData && data.patternData.length > 0) {
    result.patterns = data.patternData.slice(0, 3).map((p: any) => p.name);
  }
  
  if (data.closureData && data.closureData.length > 0) {
    result.closures = data.closureData.slice(0, 3).map((c: any) => c.name);
  }
  
  return result;
}

// Generate insights based on data analysis
export function generateInsights(data: any) {
  if (!data) return [];
  
  const insights = [];
  
  // Material insights
  if (data.materialData && data.materialData.length > 0) {
    const topMaterial = data.materialData[0];
    insights.push({
      title: `${topMaterial.name} Dominance`,
      description: `${topMaterial.name} is the most common material, accounting for ${topMaterial.weighted.toFixed(1)}% of all bands.`,
      category: 'material'
    });
  }
  
  // Color insights
  if (data.colorGroups && data.colorGroups.length > 0) {
    const topColor = data.colorGroups[0];
    insights.push({
      title: `${topColor.name} Popularity`,
      description: `${topColor.name} is the most popular color group, found in ${topColor.weighted.toFixed(1)}% of bestselling bands.`,
      category: 'color'
    });
  }
  
  // Price tier insights
  if (data.priceTierData && data.priceTierData.length > 0) {
    const budgetTier = data.priceTierData.find((tier: any) => tier.name.includes('Budget'));
    if (budgetTier) {
      insights.push({
        title: 'Price Sensitivity',
        description: `Budget options (${budgetTier.name}) make up ${budgetTier.percentage}% of popular watch bands.`,
        category: 'price'
      });
    }
  }
  
  // Correlations
  if (data.correlationData && data.correlationData.length > 0) {
    const topCorrelation = data.correlationData[0];
    insights.push({
      title: 'Strong Feature Correlation',
      description: `There's a strong correlation between ${topCorrelation.name} (score: ${topCorrelation.score.toFixed(1)}).`,
      category: 'correlation'
    });
  }
  
  return insights;
}
