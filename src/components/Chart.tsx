import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  BarController
} from 'chart.js';
import { ChartOptions, ChartData } from 'chart.js';
import './Chart.css';

// Register necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, BarController);

interface ChartProps {
  data: {
    activityMeta: {
      label: string;
      fillColor: string;
    }[];
    rows: {
      name: string;
      dayWiseActivity: {
        date: string;
        items: {
          children: {
            count: string;
            label: string;
            fillColor: string;
          }[];
        };
      }[];
    }[];
  };
}

/*
 * Chart component renders a bar chart using Chart.js.
 */

const Chart: React.FC<ChartProps> = ({ data }) => {

  // References to the canvas element and chart instance
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<ChartJS | null>(null);

  // Prepare the data for the chart
  const chartData: ChartData<'bar'> = {
    labels: data.rows[0].dayWiseActivity.map(day => day.date),
    datasets: data.activityMeta.map(activity => ({
      label: activity.label,
      backgroundColor: activity.fillColor,
      borderColor: activity.fillColor,
      borderWidth: 1,
      data: data.rows[0].dayWiseActivity.map(day => {
        const found = day.items.children.find(item => item.label === activity.label);
        return found ? parseInt(found.count) : 0;
      }),
    })),
  };

  // Chart options configuration
  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false, 
    plugins: {
      legend: {
        display: false, 
      },
      title: {
        display: true,
        text: 'Activity Data',
      },
    },
    scales: {
      x: {
        type: 'category',
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  // useEffect to initialize and update the chart
  useEffect(() => {
    if (canvasRef.current) {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
      chartRef.current = new ChartJS(canvasRef.current, {
        type: 'bar',
        data: chartData,
        options: options,
      });
    }

    // Cleanup function to destroy the chart on component unmount
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [chartData, options]);

  return (
    <div className="chart-container">
      <div style={{ position: 'relative', width: '100%', height: '400px' }}>
        <canvas ref={canvasRef} />
      </div>
      <div className="legend-container">
        {data.activityMeta.map((activity) => (
          <div key={activity.label} className="legend-item">
            <div className="legend-color" style={{ backgroundColor: activity.fillColor }}></div>
            <span className="legend-label">{activity.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chart;
