
import React from 'react';
import ReactECharts from 'echarts-for-react';
import { DailyForecast } from '../types';

interface WeatherChartProps {
  forecast: DailyForecast[];
}

const WeatherChart: React.FC<WeatherChartProps> = ({ forecast }) => {
  const options = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(5, 7, 10, 0.95)',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      borderRadius: 12,
      padding: 16,
      textStyle: { color: '#f8fafc', fontSize: 12, fontWeight: 700, fontFamily: 'Plus Jakarta Sans' },
      axisPointer: {
        type: 'line',
        lineStyle: { color: 'rgba(59, 130, 246, 0.5)', width: 2, type: 'dashed' }
      }
    },
    grid: {
      left: '0%',
      right: '2%',
      bottom: '0%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: forecast.map(f => f.date),
      axisLabel: { color: '#475569', fontSize: 10, fontWeight: 800, margin: 20 },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#475569', fontSize: 10, fontWeight: 800, formatter: '{value}°' },
      splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.03)' } },
      axisLine: { show: false },
    },
    series: [
      {
        name: 'Max Output',
        type: 'line',
        smooth: 0.4,
        data: forecast.map(f => f.tempMax),
        itemStyle: { color: '#3b82f6' },
        lineStyle: { width: 4, shadowBlur: 20, shadowColor: 'rgba(59, 130, 246, 0.5)' },
        showSymbol: false,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: 'rgba(59, 130, 246, 0.2)' }, { offset: 1, color: 'transparent' }]
          }
        },
      },
      {
        name: 'Min Output',
        type: 'line',
        smooth: 0.4,
        data: forecast.map(f => f.tempMin),
        itemStyle: { color: 'rgba(255, 255, 255, 0.2)' },
        lineStyle: { width: 2, type: 'dotted' },
        showSymbol: false,
      },
    ],
  };

  return (
    <div className="w-full h-80">
      <ReactECharts option={options} style={{ height: '100%', width: '100%' }} />
    </div>
  );
};

export default WeatherChart;
