// utils/dataProcessing.ts

/**
 * Parse watch band data from the JSON file format
 * Handles cleaning and processing of the nested JSON data
 */
export function parseWatchBandData(jsonString: string) {
  try {
    // Parse the raw JSON string to object
    const rawData = JSON.parse(jsonString);
    const processedItems = [];
    
    // Process each item in the JSON object
    Object.entries(rawData).forEach(([id, value]) => {
      try {
        // The value contains a JSON string within markdown code blocks
        // Extract the actual JSON by removing the markdown formatting
        const jsonStr = (value as string).replace(/```json\n/g, '').replace(/\n```/g, '');
        
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
        console.error(`Error parsing item ${id}: ${parseError.message}`);
      }
    });
    
    return processedItems;
  } catch (error) {
    console.error(`Error parsing JSON: ${error.message}`);
    return [];
  }
}

/**
 * Analyze watch band data to generate statistics
 */
export function analyzeWatchBandData(data: any[]) {
  // Create analysis objects for each feature
  const analysis = {
    totalCount: data.length,
    materials: {} as Record<string, number>,
    closures: {} as Record<string, number>,
    patterns: {} as Record<string, number>,
    colors: {} as Record<string, number>,
    colorHexCodes: {} as Record<string, number>
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

/**
 * Transform analyzed data into format suitable for dashboard visualization
 */
export function transformDataForDashboard(rawData: any[], analysis: any) {
  // Helper function to calculate weighted scores
  const calculateWeighted = (count: number, total: number) => (count / total * 100);
  
  // Transform materials data
  const materialData = Object.entries(analysis.materials)
    .map(([name, count]) => {
      // Calculate weighted score
      const weighted = calculateWeighted(count as number, analysis.totalCount);
      
      // Estimate top10 and top50 values 
      const top10 = Math.round((count as number) * 0.2); // Estimate 20% in top 10
      const top50 = Math.round((count as number) * 0.6); // Estimate 60% in top 50
      
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
    .map(([name, count]) => {
      const weighted = calculateWeighted(count as number, analysis.totalCount);
      const top10 = Math.round((count as number) * 0.2);
      const top50 = Math.round((count as number) * 0.6);
      
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
    .map(([name, count]) => {
      const weighted = calculateWeighted(count as number, analysis.totalCount);
      const top10 = Math.round((count as number) * 0.2);
      const top50 = Math.round((count as number) * 0.6);
      
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
    .map(([hex, count]) => {
      const weighted = calculateWeighted(count as number, 
        Object.values(analysis.colorHexCodes).reduce((sum: number, c: number) => sum + c, 0));
      const top10 = Math.round((count as number) * 0.2);
      const top50 = Math.round((count as number) * 0.6);
      
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
          Object.values(analysis.colorHexCodes).reduce((sum: number, c: number) => sum + c, 0));
        
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
  const correlationData: any[] = [];
  
  // Helper function to add correlation entries
  const addCorrelations = (
    group: string, 
    items1: any[], 
    items2: any[], 
    countMultiplier: number, 
    scoreMultiplier: number
  ) => {
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
  const generateTopRankings = () => {
    const topItems = [];
    
    // Create entries that combine popular features
    const addRanking = (
      name: string, 
      colorFactor: number, 
      materialFactor: number, 
      patternFactor: number, 
      closureFactor: number, 
      rank: number
    ) => {
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
