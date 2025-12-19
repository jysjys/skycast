
# SkyCast 3D Weather Dashboard

An ultra-modern, interactive weather application built with React, Three.js, ECharts, and GSAP.

## Features
- **3D Atmospheric Visuals**: Dynamic weather scenes using Three.js based on current conditions.
- **Advanced Data Viz**: Interactive temperature trends with ECharts.
- **Smooth UX**: Polished animations powered by GSAP.
- **Geolocation Support**: Detect weather for your current location.
- **Search History**: Persisted recent searches via LocalStorage.

## Tech Stack
- **Framework**: React 18+
- **Styling**: Tailwind CSS
- **Animations**: GSAP
- **3D Rendering**: React Three Fiber / Drei
- **Charts**: ECharts
- **Icons**: Lucide React

## Getting Started

### 1. Install Dependencies
Ensure you have `pnpm` installed.
```bash
pnpm install
```

### 2. Environment Setup
Create a `.env` file in the root directory based on `.env.example`.
Get your API key from [OpenWeatherMap](https://openweathermap.org/api).

### 3. Run Development Server
```bash
pnpm start
```

## Deployment to Vercel

1. **Push to GitHub**: Upload your code to a repository.
2. **Connect to Vercel**: Import the project from Vercel's dashboard.
3. **Environment Variables**: Add `WEATHER_API_KEY` to Vercel's project settings under "Environment Variables".
4. **Build Command**: Use `pnpm build`.
5. **Output Directory**: Use `dist`.

---
*Created by World-Class Frontend Architect.*
