# README.md

# Apple Watch Band Market Analysis Dashboard

A data visualization dashboard for analyzing Apple Watch band market trends using the Fresh framework for Deno.

## Features

- Interactive dashboard with multiple views for analyzing different aspects of the market
- Color analysis with grouping and detailed views
- Material, closure, and pattern type analysis
- Correlation analysis between different features
- Price tier distribution analysis
- Responsive design for all screen sizes

## Technologies Used

- [Deno](https://deno.land/) - A secure runtime for JavaScript and TypeScript
- [Fresh](https://fresh.deno.dev/) - A next-gen web framework for Deno
- [Preact](https://preactjs.com/) - A fast 3kB alternative to React with the same modern API
- [Recharts](https://recharts.org/) - A composable charting library built on React components
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework

## Getting Started

### Prerequisites

- [Deno](https://deno.land/#installation) (version 1.37 or later)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/watch-band-dashboard.git
   cd watch-band-dashboard
   ```

2. Make sure you have the watch band JSON data file in the `data` directory:
   ```bash
   mkdir -p data
   # Copy your watch_band_analysis.json to the data directory
   ```

3. Run the development server:
   ```bash
   deno task start
   ```

4. Open your browser and navigate to `http://localhost:8000`

## Deployment

This project is set up to deploy to [Deno Deploy](https://deno.com/deploy) using GitHub Actions:

1. Create a project on Deno Deploy
2. Connect your GitHub repository
3. Configure the project to use `main.ts` as the entrypoint
4. Push to your `main` branch to trigger deployment

## Project Structure

```
watch-band-dashboard/
├── components/         # Reusable UI components
├── islands/            # Interactive components
├── routes/             # Server routes
│   └── api/            # API endpoints
├── static/             # Static files
├── utils/              # Utility functions
├── data/               # Data files
├── deno.json           # Deno configuration
├── dev.ts              # Development server
├── fresh.config.ts     # Fresh framework configuration
├── import_map.json     # Import mappings
└── main.ts             # Entry point
```

## Data Processing

The application uses three main utility functions to process the watch band data:

1. `parseWatchBandData`: Parses the raw JSON data from the file
2. `analyzeWatchBandData`: Analyzes the parsed data to generate statistics
3. `transformDataForDashboard`: Transforms the analyzed data for visualization

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## CSS File

// static/styles.css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Additional custom styles */
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.recharts-wrapper {
  margin: 0 auto;
}

/* Improve chart readability */
.recharts-cartesian-axis-tick-value {
  font-size: 12px;
}

.recharts-legend-item-text {
  font-size: 12px;
}

/* Chart responsive fixes */
@media (max-width: 640px) {
  .recharts-cartesian-axis-tick-value {
    font-size: 10px;
  }
}

/* Animation for detail view */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fixed {
  animation: fadeIn 0.2s ease-in-out;
}
